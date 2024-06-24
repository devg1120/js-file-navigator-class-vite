import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import * as pdfWorker from "pdfjs-dist/legacy/build/pdf.worker.mjs";

export class PdfDocumentViewer {
  constructor() {
    this.pdfDoc = null;
    this.pageNum = 1;
    this.pageRendering = false;
    this.pageNumPending = null;
    this.scale = 0.8;
    document.getElementById("prev").addEventListener("click", this.onPrevPage);
    document.getElementById("next").addEventListener("click", this.onNextPage);
  }

  async start(pdfElement, pdfPath, data) {
    console.log("pdf_document start");
    const loadingTask = pdfjsLib.getDocument(pdfPath);
    //const loadingTask = pdfjsLib.getDocument({data: data});
    this.pdfDoc = await loadingTask.promise;
    document.getElementById("page_count").textContent = this.pdfDoc.numPages;
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.renderPage(this.pageNum);
    pdfElement.appendChild(this.canvas);
  }
  renderPage = (num) => {
    this.pageRendering = true;
    
    let that = this;
    this.pdfDoc.getPage(num).then(function (page) {
      var viewport = page.getViewport({ scale: that.scale });
      that.canvas.height = viewport.height;
      that.canvas.width = viewport.width;
      
      var renderContext = {
        canvasContext: that.ctx,
        viewport: viewport,
      };
      var renderTask = page.render(renderContext);

      renderTask.promise.then(function () {
        that.pageRendering = false;
        if (that.pageNumPending !== null) {
          that.renderPage(that.pageNumPending);
          that.pageNumPending = null;
        }
      });
    });

    document.getElementById("page_num").textContent = num;
  };

  queueRenderPage = (num) => {
    if (this.pageRendering) {
      this.pageNumPending = num;
    } else {
      this.renderPage(num);
    }
  };

  onPrevPage = () => {
    if (this.pageNum <= 1) {
      return;
    }
    this.pageNum--;
    this.queueRenderPage(this.pageNum);
  };

  onNextPage = () => {
    if (this.pageNum >= this.pdfDoc.numPages) {
      return;
    }
    this.pageNum++;
    this.queueRenderPage(this.pageNum);
  };
}
