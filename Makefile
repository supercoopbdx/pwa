doc: screenshots doc-pdf

screenshots:
	python3 screenshots.py

doc-pdf:
	python3 md_to_pdf.py doc_barcode_detection.md doc_barcode_detection.pdf
	python3 md_to_pdf.py doc_inventaire.md doc_inventaire.pdf
	python3 md_to_pdf.py doc_reception.md doc_reception.pdf
