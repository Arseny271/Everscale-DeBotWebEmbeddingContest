pragma ton-solidity ^ 0.47.0;
pragma AbiHeader expire;
pragma AbiHeader pubkey;
pragma AbiHeader time;

import "../interfaces/Debot.sol";

import "../interfaces/UserInfo.sol";
import "../interfaces/Terminal.sol";
import "../interfaces/Menu.sol";

/* I/O interfaces */
import "../interfaces/AddressInput.sol";
import "../interfaces/AmountInput.sol";
import "../interfaces/ConfirmInput.sol";
import "../interfaces/NumberInput.sol";         // ?
import "../interfaces/CountryInput.sol";
import "../interfaces/DateTimeInput.sol";
import "../interfaces/QRCode.sol";
import "../interfaces/AutoCompleteInput.sol";

/* proposed interfaces */
import "../interfaces/Media.sol";
import "../interfaces/Network.sol";
import "../interfaces/SigningBoxInput.sol";
import "../interfaces/EncryptionBoxInput.sol";
import "../interfaces/Query.sol";             // ?

//import "../interfaces/SecurityCardManagement.sol";



/*  */
import "../interfaces/Base64.sol";
import "../interfaces/Hex.sol";
import "../interfaces/Json.sol";
import "../interfaces/Sdk.sol";

import "QueryExample.sol";





contract TestDebot is Debot {
    bytes phrase;
    uint32 nextFunctionId;
    uint8 phase = 0;

    /* Start */

    function startDeBot() public {
        phase = 0;
        Menu.select("Select an interface for testing", "Description", [
            MenuItem("UserInfo", "UserInfo", tvm.functionId(testUserInfo)),
            MenuItem("Terminal", "Terminal", tvm.functionId(testTerminal)),

            MenuItem("AddressInput", "AddressInput", tvm.functionId(testAddressInput)),
            MenuItem("AmountInput", "AmountInput", tvm.functionId(testAmountInput)),
            MenuItem("ConfirmInput", "ConfirmInput", tvm.functionId(testConfirmInput)),
            MenuItem("CountryInput", "CountryInput", tvm.functionId(testCountryInput)),
            MenuItem("DateTimeInput", "DateTimeInput", tvm.functionId(testDateTimeInput)),
            MenuItem("NumberInput", "NumberInput", tvm.functionId(testNumberInput)),
            MenuItem("QRCode", "QRCode", tvm.functionId(testQRCode)),
            MenuItem("AutoCompleteInput", "AutoCompleteInput", tvm.functionId(testAutoCompleteInput)),

            MenuItem("Query", "Query", tvm.functionId(testQuery)),
            MenuItem("Media", "Media", tvm.functionId(testMedia)),
            MenuItem("Network", "Network", tvm.functionId(testNetwork)),
            MenuItem("SigningBoxInput", "SigningBoxInput", tvm.functionId(testSigningBoxInput)),
            MenuItem("EncryptionBoxInput", "EncryptionBoxInput", tvm.functionId(testEncryptionBoxInput)),

            

            MenuItem("Restart", "Restart", tvm.functionId(startDeBot))
        ]);
    }

    /* UserInfo */

    function testQuery() public {
        nextFunctionId = tvm.functionId(testQuery);

        if (phase == 0) {
            phase = 1; phrase = "collection:";

            ExampleContract( address.makeAddrStd(0, 0xb56527579a71642f22f093d0fd2eab4d8769f1fe59720176e5b56894838a4f97)).start();

            /*Query.collection(
                0, //tvm.functionId(setQueryResult), 
                QueryCollection.Messages, 
                format("{\"src\":{\"eq\":\"{}\"},\"msg_type\":{\"eq\":0}}", address(this)),
                "created_lt value dst body", 3,
                QueryOrderBy("created_lt", SortDirection.Ascending)
            );*/

        } else {
            startDeBot();
        }
    }

    function testUserInfo() public {
        nextFunctionId = tvm.functionId(testUserInfo);

        if (phase == 0) {
            phase = 1; phrase = "getAccount:";
            UserInfo.getAccount(tvm.functionId(print_address));
        } else if (phase == 1) {
            phase = 2; phrase = "getPublicKey:";
            UserInfo.getPublicKey(tvm.functionId(print_uint256));
        } else if (phase == 2) {
            phase = 3; phrase = "getSigningBox:";
            UserInfo.getSigningBox(tvm.functionId(print_handle));
        } else {
            startDeBot();
        }
    }

    function testAutoCompleteInput() public {
        nextFunctionId = tvm.functionId(testAutoCompleteInput);
        if (phase == 0) {
            phase = 1; phrase = "getAutoComplete:";
            AutoCompleteInput.get(tvm.functionId(print_autocomplete_result), "test", "val1:uint8:0,val2:address:0:3fb60279bee5e46ebf04c4785261892b86bbfdf454d29b8044b5e582f2e6ff33,val3:int16:-11");
        } else {
            startDeBot();
        }
    }

    function print_autocomplete_result(AutoCompleteStatus status, uint8 val1, address val2, int16 val3 ) public {
        Terminal.print(nextFunctionId, format("{} {} {} {}", phrase, val1, val2, val3));
    }

    function testTerminal() public {
        nextFunctionId = tvm.functionId(testTerminal);

        if (phase == 0) {
            phase = 1; phrase = "print:";
            Terminal.print(tvm.functionId(print_none), "Print");
        } else if (phase == 1) {
            phase = 2; phrase = "input:";
            Terminal.input(tvm.functionId(print_bytes), "Enter string", false);
        } else if (phase == 2) {
            TvmBuilder b;
            b.store(int8(1), uint32(10));
            phase = 3; phrase = "printf:";
            Terminal.printf(tvm.functionId(print_none), "Print {int8} and {uint32}", b.toCell());
        } else {
            startDeBot();
        }
    }

    function testAddressInput() public {
        nextFunctionId = tvm.functionId(testAddressInput);
        if (phase == 0) {
            phase = 1; phrase = "get:";
            AddressInput.get(tvm.functionId(print_address), "Enter address");
        } else {
            startDeBot();
        }
    }

    function testAmountInput() public {
        nextFunctionId = tvm.functionId(testAmountInput);
        if (phase == 0) {
            phase = 1; phrase = "get:";
            AmountInput.get(tvm.functionId(print_uint128), "Enter amount", 9, 1500000000, 20000000000);
        } else {
            startDeBot();
        }
    }

    function testSigningBoxInput() public {
        nextFunctionId = tvm.functionId(testSigningBoxInput);
        if (phase == 0) {
            phase = 1; phrase = "get:";
            SigningBoxInput.get(tvm.functionId(print_handle), "Enter signing box", [tvm.pubkey()]);
        } else if (phase == 1) {
            phase = 2; phrase = "get:";
            uint256[] keys;
            SigningBoxInput.get(tvm.functionId(print_handle), "Enter signing box", keys);
        } else {
            startDeBot();
        }
    }

    function testEncryptionBoxInput() public {
        nextFunctionId = tvm.functionId(testEncryptionBoxInput);
        if (phase == 0) {
            phase = 1; phrase = "getSupportedAlgorithms:";
            EncryptionBoxInput.getSupportedAlgorithms(tvm.functionId(print_algorithms));
        } else if (phase == 1) {
            phase = 2; phrase = "getNaclSecretBox:";
            EncryptionBoxInput.getNaclSecretBox(tvm.functionId(print_handle), "Enter signing box", "abcdefghijklmnopqrstuvwx");
        } else if (phase == 2) {
            phase = 3; phrase = "getNaclBox:";
            EncryptionBoxInput.getNaclBox(tvm.functionId(print_handle), "Enter signing box", "abcdefghijklmnopqrstuvwx", tvm.pubkey());
        } else if (phase == 3) {
            phase = 4; phrase = "getChaCha20Box:";
            EncryptionBoxInput.getChaCha20Box(tvm.functionId(print_handle), "Enter signing box", "abcdefghijklmnopqrstuvwx");
        } else {
            startDeBot();
        }
    }

    function testNumberInput() public {
        nextFunctionId = tvm.functionId(testNumberInput);
        if (phase == 0) {
            phase = 1; phrase = "get:";
            NumberInput.get(tvm.functionId(print_int256), "Enter number", -20000, 20000);
        } else {
            startDeBot();
        }
    }

    function testConfirmInput() public {
        nextFunctionId = tvm.functionId(testConfirmInput);
        if (phase == 0) {
            phase = 1; phrase = "get:";
            ConfirmInput.get(tvm.functionId(print_bool), "Yes / No");
        } else {
            startDeBot();
        }
    }

    function testCountryInput() public {
        nextFunctionId = tvm.functionId(testCountryInput);
        if (phase == 0) {
            phase = 1; phrase = "get:";
            string[] countries;
            CountryInput.get(tvm.functionId(print_bytes), "Enter country code:", countries, countries);
        } else {
            startDeBot();
        }
    }

    function testDateTimeInput() public {
        nextFunctionId = tvm.functionId(testDateTimeInput);

        if (phase == 0) {
            phase = 1; phrase = "getDate:";
            DateTimeInput.getDate(tvm.functionId(print_date), "Enter date:", 0, 0, 0xFFFFFFFFFFFFFFFF);
        } else if (phase == 1) {
            phase = 2; phrase = "getTime:";
            DateTimeInput.getTime(tvm.functionId(print_time), "Enter time:", 0, 0, 0xFFFFFFFF, 10);
        } else if (phase == 2) {
            phase = 3; phrase = "getDateTime:";
            DateTimeInput.getDateTime(tvm.functionId(print_datetime_with_offset), "Enter datetime:", 0, 0, 0xFFFFFFFFFFFFFFFF, 10, 0x7FFF);
        } else if (phase == 3) {
            phase = 4; phrase = "getTimeZoneOffset:";
            DateTimeInput.getTimeZoneOffset(tvm.functionId(print_timezone_offset));
        } else {
            startDeBot();
        }        
    }

    function testQRCode() public {
        nextFunctionId = tvm.functionId(testQRCode);

        if (phase == 0) {
            phase = 1; phrase = "draw:";
            QRCode.draw(tvm.functionId(print_qrcode_result), "Draw QR", "https://natribu.org/");
        } else if (phase == 1) {
            phase = 2; phrase = "read:";
            QRCode.read(tvm.functionId(print_qrcode_read_result), "Read QR");
        } else if (phase == 2) {
            phase = 3; phrase = "scan:";
            QRCode.scan(tvm.functionId(print_bytes));
        } else {
            startDeBot();
        }        
    }
    
    function testMedia() public {
        nextFunctionId = tvm.functionId(testMedia);
        
        if (phase == 0) {
            phase = 1; phrase = "getSupportedMediaTypes:";
            Media.getSupportedMediaTypes(tvm.functionId(print_media_types));
        } else if (phase == 1) {
            phase = 2; phrase = "read:";
            Media.output(tvm.functionId(print_qrcode_result), "Media", m_icon);
        } else {
            startDeBot();
        }   
    }

    function testNetwork() public {
        nextFunctionId = tvm.functionId(testNetwork);
        
        if (phase == 0) {
            phase = 1; phrase = "post:";
            Network.post(tvm.functionId(print_http_response), "https://example.com/", ["Content-Type: application/x-www-form-urlencoded"], "");
        } else if (phase == 1) {
            string[] headers;
            phase = 2; phrase = "get:";
            Network.get(tvm.functionId(print_http_response), "https://example.com/", headers);
        } else {
            startDeBot();
        }   
    }

    /* Print */

    function print_http_response(int32 statusCode, bytes[] retHeaders, bytes content) public {
        Terminal.print(0, format("{} {}", phrase, statusCode));
        
        Terminal.print(0, "Headers");
        for ( bytes header : retHeaders ) {
            Terminal.print(0, format("{}", header));
        }

        Terminal.print(nextFunctionId, format("Content: {}", content));
    }

    function print_media_types(bytes[] mediaTypes) public {
        Terminal.print(0, format("{}", phrase));
        Terminal.print(0, "Start");
        for ( bytes mediaType : mediaTypes ) {
            Terminal.print(0, format("{}", mediaType));
        }

        Terminal.print(nextFunctionId, "End");
        
    }

    function print_algorithms(bytes[] names) public {
        print_media_types(names);
    }

    function print_qrcode_result(uint8 result) public {
        Terminal.print(nextFunctionId, format("{} {}", phrase, result));
    }

    function print_qrcode_read_result(bytes value, uint8 result) public {
        Terminal.print(nextFunctionId, format("{} {} {}", phrase, value, result));
    }

    function print_date(int128 date) public {
        Terminal.print(nextFunctionId, format("{} {}", phrase, date));
    }

    function print_datetime_with_offset(int128 datetime, int16 timeZoneOffset) public {
        Terminal.print(nextFunctionId, format("{} {} {}", phrase, datetime, timeZoneOffset));
    }

    function print_timezone_offset(int16 timeZoneOffset) public {
        Terminal.print(nextFunctionId, format("{} {}", phrase, timeZoneOffset));
    }

    function print_time(uint32 time) public {
        Terminal.print(nextFunctionId, format("{} {}", phrase, time));
    }

    function print_address(address value) public {
        Terminal.print(nextFunctionId, format("{} {}", phrase, value));
    }

    function print_uint256(uint256 value) public {
        Terminal.print(nextFunctionId, format("{} 0x{:x}", phrase, value));
    }

    function print_int256(int256 value) public {
        Terminal.print(nextFunctionId, format("{} {}", phrase, value));
    }

    function print_uint128(uint128 value) public {
        Terminal.print(nextFunctionId, format("{} {}", phrase, value));
    }

    function print_bool(bool value) public {
        if (value) {
            Terminal.print(nextFunctionId, format("{} true", phrase));
        } else {
            Terminal.print(nextFunctionId, format("{} false", phrase));
        }
    }

    function print_handle(uint32 handle) public {
        Terminal.print(nextFunctionId, format("{} {}", phrase, handle));
    }

    function print_none() public {
        Terminal.print(nextFunctionId, format("{} void", phrase));
    }

    function print_bytes(bytes value) public {
        Terminal.print(nextFunctionId, format("{} {}", phrase, value));
    }

    /* DeBot basic API */

    function start() public override {
        startDeBot();
    }
    
    function getDebotInfo() public functionID(0xDEB) override view returns(
        string name, string version, string publisher, string key, string author,
        address support, string hello, string language, string dabi, bytes icon
    ) {
        name = "Test";
        version = "1.0.0";
        publisher = "Arsen12";
        key = "Universal debot for managing subscriptions";
        author = "Arsen";
        support = address.makeAddrStd(0, 0);
        hello = "Hi, I will help you manage your subscriptions.";
        language = "en";
        dabi = m_debotAbi.get();
        icon = m_icon;
    }

    function getRequiredInterfaces() public view override returns (uint256[] interfaces) {
        return [ 
            AddressInput.ID, AmountInput.ID, Base64.ID, ConfirmInput.ID, CountryInput.ID, 
            DateTimeInput.ID, Hex.ID, Json.ID, Menu.ID, NumberInput.ID, QRCode.ID, 
            Sdk.ID, Terminal.ID, UserInfo.ID, Media.ID, Network.ID, EncryptionBoxInput.ID, 
            SigningBoxInput.ID, Query.ID, AutoCompleteInput.ID
        ];
    }

    /* Setters */

    bytes m_icon;

    function setIcon(bytes icon) external {
        tvm.accept();
        m_icon = icon;
    }
}