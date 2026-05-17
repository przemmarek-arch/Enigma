import { PDFDocument } from 'pdf-lib';

const loadPdf = async (fileData, password) => {
  const pdfBytes = fileData instanceof Uint8Array ? fileData : new Uint8Array(fileData);
  return await PDFDocument.load(pdfBytes, { password });
};

const downloadBuffer = (data) => {
  return data instanceof Uint8Array ? data : new Uint8Array(data);
};

export async function encryptPDF(fileData, password) {
  try {
    const pdfDoc = await loadPdf(fileData);
    pdfDoc.encrypt({
      userPassword: password,
      ownerPassword: password,
      permissions: {
        printing: 'highResolution',
        modifying: false,
        copying: false,
        annotating: false,
        fillingForms: false,
        contentAccessibility: false,
        documentAssembly: false
      }
    });

    const encryptedBytes = await pdfDoc.save();
    return {
      success: true,
      data: downloadBuffer(encryptedBytes)
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Nie udało się zaszyfrować PDF'
    };
  }
}

export async function decryptPDF(fileData, password) {
  try {
    const pdfDoc = await loadPdf(fileData, password);
    const decryptedBytes = await pdfDoc.save();

    return {
      success: true,
      data: downloadBuffer(decryptedBytes)
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Nie udało się odszyfrować PDF'
    };
  }
}

export async function addPDFPassword(fileData, password) {
  return await encryptPDF(fileData, password);
}

export async function removePDFPassword(fileData, password) {
  try {
    const pdfDoc = await loadPdf(fileData, password);
    // Save without encryption
    const rawBytes = await pdfDoc.save();
    return {
      success: true,
      data: downloadBuffer(rawBytes)
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Nie udało się usunąć hasła z PDF'
    };
  }
}

export async function changePDFPassword(fileData, oldPassword, newPassword) {
  try {
    const pdfDoc = await loadPdf(fileData, oldPassword);
    pdfDoc.encrypt({
      userPassword: newPassword,
      ownerPassword: newPassword,
      permissions: {
        printing: 'highResolution',
        modifying: false,
        copying: false,
        annotating: false,
        fillingForms: false,
        contentAccessibility: false,
        documentAssembly: false
      }
    });
    const changedBytes = await pdfDoc.save();
    return {
      success: true,
      data: downloadBuffer(changedBytes)
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Nie udało się zmienić hasła PDF'
    };
  }
}
