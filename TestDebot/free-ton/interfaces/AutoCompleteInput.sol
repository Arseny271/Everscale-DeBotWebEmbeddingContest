pragma ton-solidity >=0.35.0;

enum AutoCompleteStatus {
    AutoCompleteSuccess,
    AutoCompleteEmpty,
    AutoCompleteFail,
    NotSupported
}

interface IAutoCompleteInput {
    function get(uint32 answerId, bytes id, bytes values) external returns (AutoCompleteStatus status);
}

library AutoCompleteInput {

    uint256 constant ID = 0x3fb60279bee5e46ebf04c4785261892b86bbfdf454d29b8044b5e582f2e6ff33;
    int8 constant DEBOT_WC = -31;

    function get(uint32 answerId, bytes id, bytes values) public pure {
        address addr = address.makeAddrStd(DEBOT_WC, ID);
        IAutoCompleteInput(addr).get(answerId, id, values);
    }

}

contract AutoCompleteInputABI is IAutoCompleteInput {
    function get(uint32 answerId, bytes id, bytes values) external override returns (AutoCompleteStatus status) {}
}

