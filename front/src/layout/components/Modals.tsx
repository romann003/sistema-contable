import { Dialog } from "primereact/dialog";

export const DeleteModal = ({ visible, header, data, message1, message1Bold, message2, message2Bold, footer, onHide }) => {

    return (
        <Dialog visible={visible} style={{ width: '32rem', minWidth: '32rem', maxWidth: '40rem', minHeight: '16rem', maxHeight: '16rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={header} modal className='p-fluid' footer={footer} onHide={onHide}>
            <div className="confirmation-content flex">
                <i className="pi pi-exclamation-triangle mr-4 mb-2" style={{ fontSize: '2rem' }} />
                {data && (
                    <span>
                        {message1} <b className="font-bold capitalize">{message1Bold}</b> {message2} <b className="font-bold">{message2Bold}</b>?
                    </span>
                )}
            </div>
        </Dialog>
    );
};
