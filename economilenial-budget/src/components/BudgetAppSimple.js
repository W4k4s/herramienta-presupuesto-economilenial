import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const BudgetDemo = () => {
    const [ingresos, setIngresos] = useState([]);
    const [ingreso, setIngreso] = useState({ concepto: '', cantidad: '' });

    const total = ingresos.reduce((sum, item) => sum + parseFloat(item.cantidad || 0), 0);

    const agregar = () => {
        if (ingreso.concepto && ingreso.cantidad) {
            setIngresos([...ingresos, { ...ingreso, id: Date.now() }]);
            setIngreso({ concepto: '', cantidad: '' });
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '20px auto', padding: '20px' }}>
            <h2 style={{ textAlign: 'center', color: '#37B8AF' }}>
                💰 {__('Presupuesto Economilenial', 'economilenial-budget')}
            </h2>
            
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                <input
                    type="text"
                    placeholder={__('Concepto', 'economilenial-budget')}
                    value={ingreso.concepto}
                    onChange={(e) => setIngreso({...ingreso, concepto: e.target.value})}
                    style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
                <input
                    type="number"
                    placeholder="€"
                    value={ingreso.cantidad}
                    onChange={(e) => setIngreso({...ingreso, cantidad: e.target.value})}
                    style={{ width: '80px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
                <button onClick={agregar} style={{ 
                    background: '#37B8AF', color: 'white', border: 'none', 
                    padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' 
                }}>
                    +
                </button>
            </div>

            {ingresos.map(item => (
                <div key={item.id} style={{ 
                    display: 'flex', justifyContent: 'space-between', 
                    padding: '8px', border: '1px solid #eee', marginBottom: '5px', borderRadius: '4px' 
                }}>
                    <span>{item.concepto}</span>
                    <strong>{parseFloat(item.cantidad).toFixed(2)}€</strong>
                </div>
            ))}

            {total > 0 && (
                <div style={{ marginTop: '20px' }}>
                    <h3 style={{ textAlign: 'center' }}>
                        📊 {__('Regla 50-30-20', 'economilenial-budget')}
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', textAlign: 'center' }}>
                        <div style={{ padding: '10px', background: '#f0f8f7', borderRadius: '4px' }}>
                            <div>🏠 50%</div>
                            <strong>{(total * 0.5).toFixed(0)}€</strong>
                            <div style={{ fontSize: '12px' }}>{__('Necesidades', 'economilenial-budget')}</div>
                        </div>
                        <div style={{ padding: '10px', background: '#f0f4f8', borderRadius: '4px' }}>
                            <div>🛍️ 30%</div>
                            <strong>{(total * 0.3).toFixed(0)}€</strong>
                            <div style={{ fontSize: '12px' }}>{__('Deseos', 'economilenial-budget')}</div>
                        </div>
                        <div style={{ padding: '10px', background: '#f0f8f0', borderRadius: '4px' }}>
                            <div>💰 20%</div>
                            <strong>{(total * 0.2).toFixed(0)}€</strong>
                            <div style={{ fontSize: '12px' }}>{__('Ahorro', 'economilenial-budget')}</div>
                        </div>
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '15px', padding: '10px', background: '#e8f4f8', borderRadius: '4px' }}>
                        <strong>{__('Total:', 'economilenial-budget')} {total.toFixed(2)}€</strong>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BudgetDemo;
