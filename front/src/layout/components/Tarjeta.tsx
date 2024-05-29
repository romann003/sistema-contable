export const Tarjeta = ({ column, title, total, activos, inactivos, color1, color2, icon }) => {
    return (
        <div className={`col-${column}`}>
            <div className="card mb-0">
                <div className="flex justify-content-between mb-3">
                    <div>
                        <span className="block text-500 font-medium mb-3">{title}</span>
                        <div className="text-900 font-medium text-xl">Total: {total}</div>
                    </div>
                    <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                        <i className={`text-xl ${icon}`} />
                    </div>
                </div>
                <div className="flex justify-content-between">
                    <div className="font-bold">
                        <span className={`text-${color1}-500 font-medium`}>Activos </span>
                        <span className="text-500">{activos}</span>
                    </div>
                    <div className="font-bold">
                        <span className={`text-${color2}-500 font-medium`}>Inactivos </span>
                        <span className="text-500">{inactivos}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}