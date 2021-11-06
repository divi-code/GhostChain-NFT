class Loader {
    async load() {
      if (this._wasm) return; //  && this._wasm2
  
      this._wasm = await import(
        '@emurgo/cardano-serialization-lib-browser/cardano_serialization_lib'
      );
  
      this._wasm2 = null
      //this._wasm2 = await import(
      //  '../../temporary_modules/@emurgo/cardano-message-signing-browser/emurgo_message_signing'
      //);
    }
  
    get Cardano() {
      return this._wasm;
    }
  
    //get Message() {
    //  return this._wasm2;
    //}
  }
  
  export default new Loader();