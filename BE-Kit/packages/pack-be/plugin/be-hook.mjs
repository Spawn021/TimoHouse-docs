/**
 * Hook runtime của plugin `be`. Logic nằm trong `runHook` của engine; file này
 * chỉ gắn pack BE. Mức thực thi: BE_KIT_HOOKS = off | warn | enforce. Mọi lỗi
 * nội bộ đều thoát 0 và không in gì. Bundle vào plugins/be/hooks/.
 */
import { runHook } from '@backend-delivery-kit/engine';
import { bePack } from '@backend-delivery-kit/pack-be';

const KIT_VERSION = typeof __BE_KIT_VERSION__ !== 'undefined' ? __BE_KIT_VERSION__ : 'dev';

runHook(bePack, { version: KIT_VERSION });
