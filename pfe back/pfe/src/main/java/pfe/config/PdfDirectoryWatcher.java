package pfe.config;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.util.ResourceUtils;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
public class PdfDirectoryWatcher {

    private static final String PDF_DIRECTORY_PATH = "classpath:pdfs/";
    private List<String> existingFiles = new ArrayList<>();

    @Scheduled(fixedDelay = 1000) // Check every 1 second
    public void checkForNewFiles() throws IOException {
        File pdfDirectory = ResourceUtils.getFile(PDF_DIRECTORY_PATH);

        // Get current files in the directory
        List<String> currentFiles = Arrays.asList(pdfDirectory.list());

        // Compare with existing files
        for (String file : currentFiles) {
            if (!existingFiles.contains(file)) {
                // New file detected, perform necessary actions
                System.out.println("New file detected: " + file);
                // For example, you can trigger a refresh of the PDFs in your application
            }
        }

        // Update existing files list
        existingFiles = new ArrayList<>(currentFiles);
    }
}

