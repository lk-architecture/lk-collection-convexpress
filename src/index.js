import getInsert from "./convroutes/insert";
import getRemove from "./convroutes/remove";
import getReplace from "./convroutes/replace";

export default function collection (options) {
    return {
        insert: getInsert(options),
        remove: getRemove(options),
        replace: getReplace(options)
    };
}
