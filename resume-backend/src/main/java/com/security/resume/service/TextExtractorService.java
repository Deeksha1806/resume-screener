package com.security.resume.service;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileInputStream;

@Service
public class TextExtractorService {

    public String extractText(File file) {

        String fileName = file.getName().toLowerCase();

        try {

            // ✅ PDF SUPPORT
            if (fileName.endsWith(".pdf")) {
                PDDocument document = PDDocument.load(file);
                PDFTextStripper stripper = new PDFTextStripper();
                String text = stripper.getText(document);
                document.close();
                return text == null ? "" : text.trim();
            }

            // ✅ DOCX SUPPORT
            if (fileName.endsWith(".docx")) {
                FileInputStream fis = new FileInputStream(file);
                XWPFDocument document = new XWPFDocument(fis);
                XWPFWordExtractor extractor = new XWPFWordExtractor(document);
                String text = extractor.getText();
                extractor.close();
                document.close();
                fis.close();
                return text == null ? "" : text.trim();
            }

            System.out.println("Unsupported file type: " + fileName);
            return "";

        } catch (Exception e) {
            e.printStackTrace();
            return "";
        }
    }
}