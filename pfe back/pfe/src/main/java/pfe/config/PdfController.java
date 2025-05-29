package pfe.config;

import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;

@RestController
@RequestMapping("/api/pdfs")
public class PdfController {

    private static final String PDF_DIRECTORY = "pdfs/";

    @Autowired
    private ResourceLoader resourceLoader;

    @GetMapping("/{fileName}")
    public ResponseEntity<byte[]> getPdf(@PathVariable String fileName) throws IOException {
        Resource resource = resourceLoader.getResource("classpath:" + PDF_DIRECTORY + fileName);
        
        if (!resource.exists()) {
            return ResponseEntity.notFound().build();
        }
        
        try (InputStream inputStream = resource.getInputStream()) {
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            byte[] buffer = new byte[1024];
            int length;
            while ((length = inputStream.read(buffer)) != -1) {
                outputStream.write(buffer, 0, length);
            }
            byte[] data = outputStream.toByteArray();
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(data);
        }
    }

}
