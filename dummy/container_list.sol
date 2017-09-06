import "./container.sol";

contract ContainerList {

  address[] list;

  function add(bytes11 _containerNumber) returns(uint){
    return list.push(address(new Container(_containerNumber, msg.sender)));
  }


  function get(uint idx) constant returns (address){
    if ( idx < list.length ){
      return list[idx];
    }
    else {
      return 0x0;
    }
  }


  function count() constant returns (uint){
    return list.length;
  }


}
