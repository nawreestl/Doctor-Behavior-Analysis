package pfe.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ResourceLoader;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import java.io.File;
@Configuration
@EnableScheduling
public class PdfAutoRefreshConfig {

    @Value("${pdf.directory}")
    private String pdfDirectory;

    private ResourceLoader resourceLoader;

    public PdfAutoRefreshConfig(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
    }

    @Scheduled(fixedRate = 1000) // Refresh every 1 second
    public void autoRefreshPdfFolder() {
        File directory = new File(pdfDirectory);
        reloadPdfFiles(directory);
    }

    private void reloadPdfFiles(File directory) {
        // Implement the logic to reload PDF files
        // For example, you can print the names of the files in the directory
        File[] files = directory.listFiles();
        if (files != null) {
            for (File file : files) {
                if (file.isFile() && file.getName().toLowerCase().endsWith(".pdf")) {
                    System.out.println("Reloaded PDF file: " + file.getName());
                }
            }
        }
    }
}

