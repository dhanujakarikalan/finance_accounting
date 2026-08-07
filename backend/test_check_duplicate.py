import urllib.request, json

def test_check_duplicate():
    url = 'http://localhost:8000/checkDuplicate'

    # 1. Existing duplicate test
    data1 = {"invoice_number": "INV-2024-001"}
    req1 = urllib.request.Request(url, data=json.dumps(data1).encode('utf-8'), headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req1) as res1:
        out1 = json.loads(res1.read().decode('utf-8'))
        print("\n--- TEST 1: Existing Duplicate ---")
        print(json.dumps(out1, indent=2))

    # 2. Unique invoice test
    data2 = {"invoice_number": "INV-UNIQUE-99999"}
    req2 = urllib.request.Request(url, data=json.dumps(data2).encode('utf-8'), headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req2) as res2:
        out2 = json.loads(res2.read().decode('utf-8'))
        print("\n--- TEST 2: Unique Invoice ---")
        print(json.dumps(out2, indent=2))

if __name__ == '__main__':
    test_check_duplicate()
