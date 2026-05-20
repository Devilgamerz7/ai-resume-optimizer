// @ts-ignore
import PDFParser from "pdf2json";

export async function parsePDF(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    // Instantiate with null (no default error handler) and true (parse raw text)
    const pdfParser = new PDFParser(null, true); 
    
    pdfParser.on("pdfParser_dataError", (errData: any) => {
      console.error("Error parsing PDF:", errData.parserError);
      reject(new Error("Failed to extract text from PDF file."));
    });
    
    pdfParser.on("pdfParser_dataReady", () => {
      // getRawTextContent() returns the raw text extracted
      const text = pdfParser.getRawTextContent();
      resolve(text);
    });
    
    pdfParser.parseBuffer(buffer);
  });
}
