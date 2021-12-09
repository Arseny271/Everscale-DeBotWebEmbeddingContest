pragma ton-solidity >= 0.47.0;
import "https://raw.githubusercontent.com/tonlabs/DeBot-IS-consortium/main/libraries/JsonLib.sol";

enum QueryCollection {
    Accounts,
    Messages,
    Transactions
}

enum SortDirection {
    Ascending,
    Descending
}

struct QueryOrderBy {
    string path;
    SortDirection direction;
}

enum QueryStatus {
    Success,
    FilterError,
    NetworkError,
    UnknownError
}

interface IQuery {

    function collection(
        uint32 answerId,
        QueryCollection collectionType,
        string queryFilter,
        string returnFilter,
        uint32 limit,
        QueryOrderBy orderBy
    ) external returns (QueryStatus status, JsonLib.Value[] objects);

}

library Query {

    uint256 constant ID = 0x5c6fd81616cdfb963632109c42144a3a885c8d0f2e8deb5d8e15872fb92f2811;
    int8 constant DEBOT_WC = -31;

    function collection(
        uint32 answerId,
        QueryCollection collectionType,
        string queryFilter,
        string returnFilter,
        uint32 limit,
        QueryOrderBy orderBy
    ) public pure {
        address addr = address.makeAddrStd(DEBOT_WC, ID);
        IQuery(addr).collection(
            answerId,
            collectionType,
            queryFilter, 
            returnFilter,
            limit,
            orderBy
        );
    }
}

contract QueryABI is IQuery {
    function collection(
        uint32 answerId,
        QueryCollection collectionType,
        string queryFilter,
        string returnFilter,
        uint32 limit,
        QueryOrderBy orderBy
    ) external override returns (QueryStatus status, JsonLib.Value[] objects) {}
}