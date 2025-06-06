<?php
/**
 * Plugin Name: Economilenial Presupuesto Mensual
 * Plugin URI: https://economilenial.com
 * Description: Herramienta interactiva para gestionar presupuestos mensuales usando la regla 50-30-20. Incluye alertas inteligentes, exportación y visualizaciones.
 * Version: 1.0.0
 * Author: Economilenial
 * Author URI: https://economilenial.com
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: economilenial-budget
 * Domain Path: /languages
 * Requires at least: 6.0
 * Tested up to: 6.4
 * Requires PHP: 8.0
 */

// Evitar acceso directo
if (!defined('ABSPATH')) {
    exit;
}

// Constantes del plugin
define('ECONOMILENIAL_BUDGET_VERSION', '1.0.0');
define('ECONOMILENIAL_BUDGET_PLUGIN_URL', plugin_dir_url(__FILE__));
define('ECONOMILENIAL_BUDGET_PLUGIN_PATH', plugin_dir_path(__FILE__));

/**
 * Clase principal del plugin
 */
class EconomileniaBudgetPlugin {
    
    public function __construct() {
        add_action('init', array($this, 'init'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_frontend_assets'));
        add_action('enqueue_block_editor_assets', array($this, 'enqueue_block_assets'));
        register_activation_hook(__FILE__, array($this, 'activate'));
        register_deactivation_hook(__FILE__, array($this, 'deactivate'));
    }
    
    /**
     * Inicialización del plugin
     */
    public function init() {
        // Cargar traducciones
        load_plugin_textdomain('economilenial-budget', false, dirname(plugin_basename(__FILE__)) . '/languages');
        
        // Registrar bloque Gutenberg
        $this->register_block();
        
        // Registrar shortcode
        add_shortcode('economilenial_presupuesto', array($this, 'shortcode_handler'));
        
        // Incluir REST API
        $this->include_rest_api();
        
        // Crear tabla personalizada para usuarios registrados
        $this->maybe_create_database_table();
    }
    
    /**
     * Registrar el bloque Gutenberg
     */
    private function register_block() {
        register_block_type(ECONOMILENIAL_BUDGET_PLUGIN_PATH . 'build', array(
            'render_callback' => array($this, 'render_block')
        ));
    }
    
    /**
     * Renderizar el bloque en frontend
     */
    public function render_block($attributes, $content) {
        // Generar ID único para esta instancia
        $block_id = 'economilenial-budget-' . wp_generate_uuid4();
        
        ob_start();
        ?>
        <div id="<?php echo esc_attr($block_id); ?>" class="economilenial-budget-container">
            <div class="economilenial-budget-loading">
                <p><?php _e('Cargando herramienta de presupuesto...', 'economilenial-budget'); ?></p>
            </div>
        </div>
        <script>
            // Pasar datos de WordPress a React
            window.economileniaBudgetData = window.economileniaBudgetData || {};
            window.economileniaBudgetData['<?php echo $block_id; ?>'] = {
                apiUrl: '<?php echo esc_url(rest_url('economilenial/v1/')); ?>',
                nonce: '<?php echo wp_create_nonce('wp_rest'); ?>',
                isLoggedIn: <?php echo is_user_logged_in() ? 'true' : 'false'; ?>,
                userId: <?php echo get_current_user_id(); ?>,
                attributes: <?php echo json_encode($attributes); ?>
            };
        </script>
        <?php
        return ob_get_clean();
    }
    
    /**
     * Shortcode handler
     */
    public function shortcode_handler($atts) {
        $attributes = shortcode_atts(array(
            'theme' => 'default',
            'show_export' => 'true'
        ), $atts);
        
        return $this->render_block($attributes, '');
    }
    
    /**
     * Enqueue assets para frontend
     */
    public function enqueue_frontend_assets() {
        if (has_block('economilenial/budget') || has_shortcode(get_post()->post_content ?? '', 'economilenial_presupuesto')) {
            wp_enqueue_script(
                'economilenial-budget-frontend',
                ECONOMILENIAL_BUDGET_PLUGIN_URL . 'build/index.js',
                array('wp-element', 'wp-api-fetch'),
                ECONOMILENIAL_BUDGET_VERSION,
                true
            );
            
            wp_enqueue_style(
                'economilenial-budget-frontend',
                ECONOMILENIAL_BUDGET_PLUGIN_URL . 'build/style-index.css',
                array(),
                ECONOMILENIAL_BUDGET_VERSION
            );
        }
    }
    
    /**
     * Enqueue assets para editor Gutenberg
     */
    public function enqueue_block_assets() {
        wp_enqueue_script(
            'economilenial-budget-editor',
            ECONOMILENIAL_BUDGET_PLUGIN_URL . 'build/index.js',
            array('wp-blocks', 'wp-element', 'wp-editor'),
            ECONOMILENIAL_BUDGET_VERSION,
            true
        );
        
        wp_enqueue_style(
            'economilenial-budget-editor',
            ECONOMILENIAL_BUDGET_PLUGIN_URL . 'build/index.css',
            array('wp-edit-blocks'),
            ECONOMILENIAL_BUDGET_VERSION
        );
    }
    
    /**
     * Incluir REST API
     */
    private function include_rest_api() {
        require_once ECONOMILENIAL_BUDGET_PLUGIN_PATH . 'includes/class-rest-api.php';
        new EconomileniaBudget_REST_API();
    }
    
    /**
     * Crear tabla de base de datos si no existe
     */
    private function maybe_create_database_table() {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'economilenial_budget';
        
        $charset_collate = $wpdb->get_charset_collate();
        
        $sql = "CREATE TABLE $table_name (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            user_id bigint(20) NOT NULL,
            budget_data longtext NOT NULL,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY user_id (user_id)
        ) $charset_collate;";
        
        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        dbDelta($sql);
    }
    
    /**
     * Activación del plugin
     */
    public function activate() {
        $this->maybe_create_database_table();
        flush_rewrite_rules();
    }
    
    /**
     * Desactivación del plugin
     */
    public function deactivate() {
        flush_rewrite_rules();
    }
}

// Inicializar el plugin
new EconomileniaBudgetPlugin();
