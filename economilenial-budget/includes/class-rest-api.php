<?php
/**
 * REST API para el plugin Economilenial Budget
 * Maneja CRUD de presupuestos para usuarios registrados
 */

if (!defined('ABSPATH')) {
    exit;
}

class EconomileniaBudget_REST_API {
    
    private $namespace = 'economilenial/v1';
    
    public function __construct() {
        add_action('rest_api_init', array($this, 'register_routes'));
    }
    
    /**
     * Registrar todas las rutas de la API
     */
    public function register_routes() {
        // Obtener presupuesto del usuario
        register_rest_route($this->namespace, '/budget', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_budget'),
            'permission_callback' => array($this, 'check_permission')
        ));
        
        // Guardar/actualizar presupuesto
        register_rest_route($this->namespace, '/budget', array(
            'methods' => 'POST',
            'callback' => array($this, 'save_budget'),
            'permission_callback' => array($this, 'check_permission'),
            'args' => array(
                'budget_data' => array(
                    'required' => true,
                    'validate_callback' => array($this, 'validate_budget_data')
                )
            )
        ));
        
        // Exportar presupuesto
        register_rest_route($this->namespace, '/budget/export', array(
            'methods' => 'POST',
            'callback' => array($this, 'export_budget'),
            'permission_callback' => array($this, 'check_permission'),
            'args' => array(
                'format' => array(
                    'required' => true,
                    'enum' => array('csv', 'pdf')
                )
            )
        ));
    }
    
    /**
     * Verificar permisos
     */
    public function check_permission() {
        return is_user_logged_in();
    }
    
    /**
     * Validar datos del presupuesto
     */
    public function validate_budget_data($value) {
        if (!is_array($value)) {
            return false;
        }
        
        // Validar estructura básica
        $required_fields = array('ingresos', 'gastos', 'distribucion');
        foreach ($required_fields as $field) {
            if (!isset($value[$field])) {
                return false;
            }
        }
        
        return true;
    }
    
    /**
     * Obtener presupuesto del usuario actual
     */
    public function get_budget(WP_REST_Request $request) {
        global $wpdb;
        
        $user_id = get_current_user_id();
        $table_name = $wpdb->prefix . 'economilenial_budget';
        
        $result = $wpdb->get_row(
            $wpdb->prepare(
                "SELECT budget_data, updated_at FROM $table_name WHERE user_id = %d ORDER BY updated_at DESC LIMIT 1",
                $user_id
            )
        );
        
        if (!$result) {
            return new WP_REST_Response(array(
                'success' => true,
                'data' => null,
                'message' => __('No hay presupuesto guardado', 'economilenial-budget')
            ), 200);
        }
        
        return new WP_REST_Response(array(
            'success' => true,
            'data' => json_decode($result->budget_data, true),
            'last_updated' => $result->updated_at
        ), 200);
    }
    
    /**
     * Guardar presupuesto del usuario
     */
    public function save_budget(WP_REST_Request $request) {
        global $wpdb;
        
        $user_id = get_current_user_id();
        $budget_data = $request->get_param('budget_data');
        $table_name = $wpdb->prefix . 'economilenial_budget';
        
        // Verificar si ya existe un presupuesto para este usuario
        $existing = $wpdb->get_var(
            $wpdb->prepare(
                "SELECT id FROM $table_name WHERE user_id = %d",
                $user_id
            )
        );
        
        if ($existing) {
            // Actualizar existente
            $result = $wpdb->update(
                $table_name,
                array(
                    'budget_data' => json_encode($budget_data),
                    'updated_at' => current_time('mysql')
                ),
                array('user_id' => $user_id),
                array('%s', '%s'),
                array('%d')
            );
        } else {
            // Crear nuevo
            $result = $wpdb->insert(
                $table_name,
                array(
                    'user_id' => $user_id,
                    'budget_data' => json_encode($budget_data),
                    'created_at' => current_time('mysql'),
                    'updated_at' => current_time('mysql')
                ),
                array('%d', '%s', '%s', '%s')
            );
        }
        
        if ($result === false) {
            return new WP_REST_Response(array(
                'success' => false,
                'message' => __('Error al guardar el presupuesto', 'economilenial-budget')
            ), 500);
        }
        
        return new WP_REST_Response(array(
            'success' => true,
            'message' => __('Presupuesto guardado correctamente', 'economilenial-budget')
        ), 200);
    }
    
    /**
     * Exportar presupuesto en CSV o PDF
     */
    public function export_budget(WP_REST_Request $request) {
        $format = $request->get_param('format');
        $budget_data = $request->get_param('budget_data');
        
        if ($format === 'csv') {
            return $this->export_csv($budget_data);
        } elseif ($format === 'pdf') {
            return $this->export_pdf($budget_data);
        }
        
        return new WP_REST_Response(array(
            'success' => false,
            'message' => __('Formato no válido', 'economilenial-budget')
        ), 400);
    }
    
    /**
     * Exportar como CSV
     */
    private function export_csv($budget_data) {
        $filename = 'presupuesto-economilenial-' . date('Y-m-d') . '.csv';
        
        header('Content-Type: text/csv');
        header('Content-Disposition: attachment; filename="' . $filename . '"');
        header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
        
        $output = fopen('php://output', 'w');
        
        // Cabeceras del CSV
        fputcsv($output, array('Categoría', 'Concepto', 'Cantidad', 'Porcentaje'));
        
        // Datos de ingresos
        if (isset($budget_data['ingresos'])) {
            foreach ($budget_data['ingresos'] as $ingreso) {
                fputcsv($output, array('Ingresos', $ingreso['concepto'], $ingreso['cantidad'], ''));
            }
        }
        
        // Datos de gastos
        if (isset($budget_data['gastos'])) {
            foreach ($budget_data['gastos'] as $categoria => $gastos) {
                foreach ($gastos as $gasto) {
                    fputcsv($output, array(
                        ucfirst($categoria),
                        $gasto['concepto'],
                        $gasto['cantidad'],
                        isset($gasto['porcentaje']) ? $gasto['porcentaje'] . '%' : ''
                    ));
                }
            }
        }
        
        fclose($output);
        exit;
    }
    
    /**
     * Exportar como PDF (simplificado)
     */
    private function export_pdf($budget_data) {
        // En una implementación real, usarías una librería como TCPDF o DOMPDF
        // Por ahora, devolvemos un enlace para generar el PDF en frontend
        return new WP_REST_Response(array(
            'success' => true,
            'download_url' => admin_url('admin-ajax.php?action=economilenial_export_pdf&nonce=' . wp_create_nonce('export_pdf'))
        ), 200);
    }
}
