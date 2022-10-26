import mitt, { Emitter } from 'mitt'

let emitter: Emitter<any> | undefined;

if (!emitter) {
  emitter = mitt();
}

export default emitter as Emitter<any>;
