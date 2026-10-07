import os
import pymupdf as fitz
from docx import Document

def extract_text_from_pdf(pdf_path: str) -> str:
    """Extracts text content from a PDF file using PyMuPDF."""
    text = []
    with fitz.open(pdf_path) as doc:
        for page in doc:
            text.append(page.get_text())
    return "\n".join(text).strip()

def extract_text_from_docx(docx_path: str) -> str:
    """Extracts text content from a DOCX file."""
    doc = Document(docx_path)
    text = [para.text for para in doc.paragraphs if para.text.strip()]
    return "\n".join(text).strip()

def extract_resume_text(file_path: str) -> str:
    """Automatically detects format and extracts raw text."""
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")
        
    ext = os.path.splitext(file_path)[1].lower()
    
    if ext == ".pdf":
        text = extract_text_from_pdf(file_path)
    elif ext in [".docx", ".doc"]:
        text = extract_text_from_docx(file_path)
    elif ext == ".txt":
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            text = f.read().strip()
    else:
        raise ValueError(f"Unsupported file format: {ext}")
        
    if len(text) < 50:
        raise ValueError("Extracted text is too short. The file might be a scanned image.")
        
    return text

if __name__ == "__main__":
    # Test script locally with any resume file
    import sys
    if len(sys.argv) > 1:
        extracted = extract_resume_text(sys.argv[1])
        print("--- EXTRACTED RESUME TEXT ---")
        print(extracted[:500] + "...")