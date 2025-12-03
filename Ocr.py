import pytesseract
from PIL import Image
import cv2
import numpy as np
import matplotlib.pyplot as plt

class OcrClass:
    def __init__(self, path, lan):
        self.path = path
        self.lan = lan

    def Load(self):
        # Set the path to the Tesseract executable
        pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
        
        # Load the image using PIL
        self.image = Image.open(self.path)
        
        # Convert PIL Image to NumPy array for OpenCV processing
        self.image_np = np.array(self.image)

    def Preprocess(self):
        # Upscale the image using OpenCV
        self.upscaled_image = cv2.resize(self.image_np, None, fx=2, fy=2, interpolation=cv2.INTER_LINEAR)
        
        # Convert to grayscale if it's a color image
        if len(self.upscaled_image.shape) == 3:  # Color image (3 channels)
            self.gray = cv2.cvtColor(self.upscaled_image, cv2.COLOR_BGR2GRAY)
        else:  # Grayscale image (1 channel)
            self.gray = self.upscaled_image
        
        # Apply Gaussian blur
        self.blurred = cv2.GaussianBlur(self.gray, (5, 5), 0)
        
        # Apply Canny edge detection
        self.edges = cv2.Canny(self.blurred, 1, 150)

    def Deriver(self):
        # Perform OCR on the preprocessed image
        text = pytesseract.image_to_string(self.image, lang=self.lan)
        text2 = pytesseract.image_to_string(self.edges, lang=self.lan)
        text3 = pytesseract.image_to_string(self.blurred, lang=self.lan)
        
        # Save the extracted text to a file
        return {
            "text1":text,
            "text2":text2,
            "text3":text3
        }

    def Show(self):
        # Display the original and processed images
        plt.subplot(1, 2, 1)
        plt.title('Original Image')
        plt.imshow(cv2.cvtColor(self.image_np, cv2.COLOR_BGR2RGB))
        plt.axis('off')

        plt.subplot(1, 2, 2)
        plt.title('Canny Edges')
        plt.imshow(self.edges, cmap='gray')
        plt.axis('off')

        plt.show()

# if __name__ == "__main__":
#     # Initialize the OCR object
#     c = Ocr("img.png", "fas")
    
#     # Load the image
#     c.Load()
    
#     # Preprocess the image (upscale, grayscale, blur, and edge detection)
#     c.Preprocess()
    
#     # Perform OCR and save the result
#     # c.Deriver()
    
#     # Display the images
#     c.Deriver()
#     c.Show()