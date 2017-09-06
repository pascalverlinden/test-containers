contract Container {
  bytes11 public containerNumber;
  address owner;


  function Container(bytes11 _containerNumber, address _owner){
    containerNumber = _containerNumber;
    owner = _owner;
  }


}
