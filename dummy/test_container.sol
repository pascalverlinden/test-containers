import "./container_list.sol";
import "./container.sol";

contract TestContainer {

  ContainerList containers;


  function init(address list){
    containers = ContainerList(list);
  }


  function testAdd() constant returns (string) {
    if ( containers.count() != 0 ){
      return "should have no containers initially";
    }
    if ( containers.add("XYZU0000001") != 1 ) {
      return "should add first container";
    }
    if ( containers.add("XYZU0000002") != 2 ) {
      return "should add second container";
    }
    return "success";
  }


  function testGet() constant returns (string) {
    Container ctr;
    address ctrAddr;
    if ( containers.count() != 2 ){
      return "should have 2 containers";
    }
    ctrAddr = containers.get(0);
    if ( ctrAddr == 0x0 ){
      return "should get valid address for container 1";
    }
    ctr = Container(ctrAddr);
    if ( ctr.containerNumber() != "XYZU0000001" ){
      return "should get container XYZU0000001";
    }
    return "success";
  }


}
