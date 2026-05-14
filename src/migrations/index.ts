import * as migration_20260513_184916_setup_new_relations from './20260513_184916_setup_new_relations';

export const migrations = [
  {
    up: migration_20260513_184916_setup_new_relations.up,
    down: migration_20260513_184916_setup_new_relations.down,
    name: '20260513_184916_setup_new_relations'
  },
];
