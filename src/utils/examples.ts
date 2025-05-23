import { deepClone, deepCloneOverall } from './tool';

// 示例1：没有指定类型参数
const date1 = new Date();
const clonedDate1 = deepClone(date1);
// clonedDate1 的类型会被推断为 Date

// 示例2：指定类型参数
const date2 = new Date();
const clonedDate2 = deepClone<Date>(date2);
// clonedDate2 的类型为 Date

// 示例3：作为对象的属性
interface User {
  name: string;
  birthDate: Date;
}

const user = {
  name: "John",
  birthDate: new Date()
};
const clonedUser = deepClone(user);
// clonedUser 的类型会被推断为 { name: string; birthDate: Date; }

// 示例4：使用 deepCloneOverall
const dateWithCircular = new Date();
const clonedDateWithCircular = deepCloneOverall(dateWithCircular);
// clonedDateWithCircular 的类型会被推断为 Date

// 示例5：没有类型注解的对象
const obj = {
  date: new Date(),
  name: "test"
};
const clonedObj = deepClone(obj);
// clonedObj 的类型会被推断为 { date: Date; name: string; }