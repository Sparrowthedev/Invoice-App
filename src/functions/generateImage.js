import html2canvas from "html2canvas";
export const generateImg = (setFileGenerateModal) => {
    const input = document.getElementById('bill');
    html2canvas(input)
        .then(function (canvas) {
            let anchorTag = document.createElement("a");
            anchorTag.download = "invoice.png";
            anchorTag.href = canvas.toDataURL();
            anchorTag.click();
        });
    setFileGenerateModal(false)
}