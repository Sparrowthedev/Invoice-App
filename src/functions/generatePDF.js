import JsPDF from "jspdf";

export const generatePDF = (setFileGenerateModal) => {
    const invoice = new JsPDF('portrait', 'pt', 'a2');
    invoice.html(document.querySelector('#bill'))
        .then(() => {
            invoice.save('report.pdf');
            setFileGenerateModal(false)
        })
}