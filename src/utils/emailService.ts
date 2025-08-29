interface ContactFormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  message: string;
}

interface CustomOrderFormData extends Omit<ContactFormData, 'message'> {
  projectDetails: string;
  fileUrl?: string;
}

export async function sendContactEmail(data: ContactFormData): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send message');
    }

    return { success: true };
  } catch (error) {
    console.error('Error sending contact email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send message' 
    };
  }
}

export async function sendCustomOrderEmail(data: CustomOrderFormData): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/custom-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send custom order');
    }

    return { success: true };
  } catch (error) {
    console.error('Error sending custom order email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send custom order' 
    };
  }
}
