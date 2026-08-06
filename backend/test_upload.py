import urllib.request, json

def test_upload():
    boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW'
    file_content = b'Sample PDF content for invoice from Acme Test Corp'
    
    body = (
        f'--{boundary}\r\n'
        f'Content-Disposition: form-data; name="file"; filename="Sample_Acme_Invoice.pdf"\r\n'
        f'Content-Type: application/pdf\r\n\r\n'
    ).encode('utf-8') + file_content + f'\r\n--{boundary}--\r\n'.encode('utf-8')

    req = urllib.request.Request(
        'http://localhost:8000/uploadInvoice',
        data=body,
        headers={'Content-Type': f'multipart/form-data; boundary={boundary}'},
        method='POST'
    )

    with urllib.request.urlopen(req) as response:
        result = json.loads(response.read().decode('utf-8'))
        print("\n================== UPLOAD INVOICE TEST RESULT ==================")
        print(json.dumps(result, indent=2))
        print("=================================================================\n")

if __name__ == '__main__':
    test_upload()
