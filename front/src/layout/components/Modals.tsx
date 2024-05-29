import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { TabPanel, TabPanelHeaderTemplateOptions, TabView } from "primereact/tabview";

const breakpoints = { '960px': '75vw', '641px': '90vw' };
const largeSyles = { width: '70rem', height:'43rem', minWidth: '60rem', maxWidth: '90vw', minHeight: '40rem', maxHeight: '90vh' };
const mediumSyles = { width: '50rem', height:'43rem', minWidth: '50rem', maxWidth: '90vw', minHeight: '40rem', maxHeight: '90vh' };
const smallStyles = { width: '30rem', height: '42rem', minWidth: '30rem', maxWidth: '70vw', minHeight: '40rem', maxHeight: '90vh' };

export const DeleteModal = ({ visible, header, data, message1, message1Bold, message2, message2Bold, footer, onHide }) => {

    return (
        <Dialog visible={visible} style={{ width: '32rem', minWidth: '32rem', maxWidth: '40rem', minHeight: '16rem', maxHeight: '16rem' }} breakpoints={breakpoints} header={header} modal className='p-fluid' footer={footer} onHide={onHide}>
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

export const ComfirmHideModal = ({ visible, header, message1, message1Bold, message2, message2Bold, footer, onHide }) => {

    return (
        <Dialog visible={visible} style={{ width: '32rem', minWidth: '32rem', maxWidth: '40rem', minHeight: '16rem', maxHeight: '16rem' }} breakpoints={breakpoints} header={header} modal className='p-fluid' footer={footer} onHide={onHide}>
            <div className="confirmation-content flex">
                <i className="pi pi-exclamation-triangle mr-4 mb-2" style={{ fontSize: '2rem' }} />
                    <span>
                        {message1} <b className="font-bold capitalize">{message1Bold}</b> {message2} <b className="font-bold">{message2Bold}</b>
                    </span>
            </div>
        </Dialog>
    );
};

export const LargeModal = ({ visible, header, footer, onHide, children, closeOnEscape, blockScroll, dismissableMask }) => {
    return (
        <Dialog visible={visible} style={largeSyles} breakpoints={breakpoints} header={header} modal className='p-fluid' footer={footer} onHide={onHide} dismissableMask={dismissableMask} blockScroll={blockScroll} closeOnEscape={closeOnEscape}>
            {children}
        </Dialog>
    );
}

export const MediumModal = ({ visible, header, footer, onHide, children, closeOnEscape, blockScroll, dismissableMask }) => {
    return (
        <Dialog visible={visible} style={mediumSyles} breakpoints={breakpoints} header={header} modal className='p-fluid' footer={footer} onHide={onHide} dismissableMask={dismissableMask} blockScroll={blockScroll} closeOnEscape={closeOnEscape}>
            {children}
        </Dialog>
    );
}

export const SmallModal = ({ visible, header, footer, onHide, children, closeOnEscape, blockScroll, dismissableMask }) => {
    return (
        <Dialog visible={visible} style={smallStyles} breakpoints={breakpoints} header={header} modal className='p-fluid' footer={footer} onHide={onHide} dismissableMask={dismissableMask} blockScroll={blockScroll} closeOnEscape={closeOnEscape}>
            {children}
        </Dialog>
    );
}
// style={{ width: '62rem', minWidth: '60rem', maxWidth: '90vw', minHeight: '30rem', maxHeight: '90vh' }}
export const InfoModal = ({ tbHeader1, tbHeader2, tbHeader3, visible, header, footer, onHide, data, tb1, tb2, tb3,

    tb1Titulo1, tb1Dato1, tb1Titulo2, tb1Dato2, tb1Titulo3, tb1Dato3, tb1Titulo4, tb1Dato4, tb1Titulo5, tb1Dato5, tb1Titulo6, tb1Dato6, tb1Titulo7, tb1Dato7, tb1Titulo8, tb1Dato8, tb1Divisor1, tb1Titulo9, tb1Dato9, tb1Titulo10, tb1Dato10, tb1Divisor2, tb1Divisor2Text,
    tb2Ttulo1, tb2Dato1, tb2Ttulo2, tb2Dato2, tb2Ttulo3, tb2Dato3, tb2Ttulo4, tb2Dato4, tb2Titulo5, tb2Dato5, tb2Titulo6, tb2Dato6, tb2Titulo7, tb2Dato7, tb2Titulo8, tb2Dato8, tb2Divisor1, tb2Titulo9, tb2Dato9, tb2Ttulo10, tb2Dato10, tb2Divisor2, dtb2Dvisor2Text,
    tb3Titulo1, tb3Dato1, tb3Titulo2, tb3Dato2, tb3Titulo3, tb3Dato3, tb3Titulo4, tb3Dato4, tb3Titulo5, tb3Dato5, tb3Titulo6, tb3Dato6, tb3Titulo7, tb3Dato7, tb3Titulo8, tb3Dato8, tb3Divisor1, tb3Titulo9, tb3Dato9, tb3Titulo10, tb3Dato10, tb3Divisor2, tb3Divisor2Text

}) => {

    //? -------------------- TABS (DETAILS DIALOG) -------------------
    const tab1HeaderTemplate = (options: TabPanelHeaderTemplateOptions) => {
        return (
            <div className="flex align-items-center gap-2 p-3 justify-content-center" style={{ cursor: 'pointer' }} onClick={options.onClick}>
                <span className="font-bold white-space-nowrap">{tbHeader1}</span>
            </div>
        );
    };

    const tab2HeaderTemplate = (options: TabPanelHeaderTemplateOptions) => {
        return (
            <div className="flex align-items-center gap-2 p-3 justify-content-center" style={{ cursor: 'pointer' }} onClick={options.onClick}>
                <span className="font-bold white-space-nowrap">{tbHeader2}</span>
            </div>
        )
    };

    const tab3HeaderTemplate = (options: TabPanelHeaderTemplateOptions) => {
        return (
            <div className="flex align-items-center gap-2 p-3 justify-content-center" style={{ cursor: 'pointer' }} onClick={options.onClick}>
                <span className="font-bold white-space-nowrap">{tbHeader3}</span>
            </div>
        )
    };

    return (
        <Dialog visible={visible} style={{ width: '62rem', minWidth: '30rem', minHeight: '30rem', maxWidth: '90vw', maxHeight: '90vh' }} breakpoints={breakpoints} header={header} modal className='p-fluid' footer={footer} onHide={onHide}>
            <div className="confirmation-content">
                {data && (<>
                    {data.id ? (<>
                        <div className="card">
                            <TabView>
                                {tb1 && (

                                    <TabPanel className='w-full' header="Header I" headerTemplate={tab1HeaderTemplate}>
                                        <div className="field mt-5 mb-3">
                                            <div className="formgrid grid">
                                                <div className="col-12">
                                                    <div className="flex flex-wrap gap-3 justify-content-between">
                                                        <label className='text-md capitalize'> <b>{tb1Titulo1}</b> {tb1Dato1}</label>
                                                        <label className='text-md capitalize'> <b>{tb1Titulo2}</b> {tb1Dato2}</label>
                                                        <label className='text-md capitalize'> <b>{tb1Titulo3}</b> {tb1Dato3}</label>
                                                        <label className='text-md capitalize'> <b>{tb1Titulo4}</b> {tb1Dato4}</label>

                                                        {tb1Divisor1 && (
                                                            <Divider align="center" />
                                                        )}

                                                        <label className='text-md capitalize'> <b>{tb1Titulo5}</b> {tb1Dato5}</label>
                                                        <label className='text-md capitalize'> <b>{tb1Titulo6}</b> {tb1Dato6}</label>
                                                        <label className='text-md capitalize'> <b>{tb1Titulo7}</b> {tb1Dato7}</label>
                                                        <label className='text-md capitalize'> <b>{tb1Titulo8}</b> {tb1Dato8}</label>
                                                    </div>
                                                    {tb1Divisor2 && (
                                                        <Divider align="center" className='my-5'>
                                                            <span className="p-tag">{tb1Divisor2Text}</span>
                                                        </Divider>
                                                    )}
                                                    <div className="flex flex-wrap gap-3 justify-content-center">
                                                        <label className='text-md capitalize'> <b>{tb1Titulo9}</b> {tb1Dato9}</label>
                                                        <label className='text-md capitalize'> <b>{tb1Titulo10}</b> {tb1Dato10}</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </TabPanel>
                                )}

                                {tb2 && (

                                    <TabPanel className='w-full' header="Header I" headerTemplate={tab1HeaderTemplate}>
                                        <div className="field mt-5 mb-3">
                                            <div className="formgrid grid">
                                                <div className="col-12">
                                                    <div className="flex flex-wrap gap-3 justify-content-between">
                                                        <label className='text-md capitalize'> <b>{tb2Ttulo1}</b> {tb2Dato1}</label>
                                                        <label className='text-md capitalize'> <b>{tb2Ttulo2}</b> {tb2Dato2}</label>
                                                        <label className='text-md capitalize'> <b>{tb2Ttulo3}</b> {tb2Dato3}</label>
                                                        <label className='text-md capitalize'> <b>{tb2Ttulo4}</b> {tb2Dato4}</label>

                                                        {tb2Divisor1 && (
                                                            <Divider align="center" />
                                                        )}

                                                        <label className='text-md capitalize'> <b>{tb2Titulo5}</b> {tb2Dato5}</label>
                                                        <label className='text-md capitalize'> <b>{tb2Titulo6}</b> {tb2Dato6}</label>
                                                        <label className='text-md capitalize'> <b>{tb2Titulo7}</b> {tb2Dato7}</label>
                                                        <label className='text-md capitalize'> <b>{tb2Titulo8}</b> {tb2Dato8}</label>
                                                    </div>
                                                    {tb2Divisor2 && (
                                                        <Divider align="center" className='my-5'>
                                                            <span className="p-tag">{dtb2Dvisor2Text}</span>
                                                        </Divider>
                                                    )}
                                                    <div className="flex flex-wrap gap-3 justify-content-center">
                                                        <label className='text-md capitalize'> <b>{tb2Titulo9}</b> {tb2Dato9}</label>
                                                        <label className='text-md capitalize'> <b>{tb2Ttulo10}</b> {tb2Dato10}</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </TabPanel>
                                )}

                                {tb3 && (

                                    <TabPanel className='w-full' header="Header I" headerTemplate={tab1HeaderTemplate}>
                                        <div className="field mt-5 mb-3">
                                            <div className="formgrid grid">
                                                <div className="col-12">
                                                    <div className="flex flex-wrap gap-3 justify-content-between">
                                                        <label className='text-md capitalize'> <b>{tb3Titulo1}</b> {tb3Dato1}</label>
                                                        <label className='text-md capitalize'> <b>{tb3Titulo2}</b> {tb3Dato2}</label>
                                                        <label className='text-md capitalize'> <b>{tb3Titulo3}</b> {tb3Dato3}</label>
                                                        <label className='text-md capitalize'> <b>{tb3Titulo4}</b> {tb3Dato4}</label>

                                                        {tb3Divisor1 && (
                                                            <Divider align="center" />
                                                        )}

                                                        <label className='text-md capitalize'> <b>{tb3Titulo5}</b> {tb3Dato5}</label>
                                                        <label className='text-md capitalize'> <b>{tb3Titulo6}</b> {tb3Dato6}</label>
                                                        <label className='text-md capitalize'> <b>{tb3Titulo7}</b> {tb3Dato7}</label>
                                                        <label className='text-md capitalize'> <b>{tb3Titulo8}</b> {tb3Dato8}</label>
                                                    </div>
                                                    {tb3Divisor2 && (
                                                        <Divider align="center" className='my-5'>
                                                            <span className="p-tag">{tb3Divisor2Text}</span>
                                                        </Divider>
                                                    )}
                                                    <div className="flex flex-wrap gap-3 justify-content-center">
                                                        <label className='text-md capitalize'> <b>{tb3Titulo9}</b> {tb3Dato9}</label>
                                                        <label className='text-md capitalize'> <b>{tb3Titulo10}</b> {tb3Dato10}</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </TabPanel>
                                )}

                            </TabView>
                        </div>
                    </>) : (<></>)}
                </>)}
            </div>
        </Dialog>
    );

}

// TABS
export const TabHeaderTemplate = (options: TabPanelHeaderTemplateOptions, detalles) => {
    return (
        <div className="flex align-items-center gap-2 p-3 justify-content-center" style={{ cursor: 'pointer' }} onClick={options.onClick}>
            <span className="font-bold white-space-nowrap">{detalles}</span>
        </div>
    )
};