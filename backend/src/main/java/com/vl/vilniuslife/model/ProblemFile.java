package com.vl.vilniuslife.model;

public class ProblemFile {
    String fileName;
    String filePath;

    public ProblemFile(String fileName, String filePath) {
        this.fileName = fileName;
        this.filePath = filePath;
    }

    public ProblemFile() {}

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }
}
