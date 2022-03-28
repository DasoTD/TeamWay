const arr = [{id: 1, name: 'one'}, {id: 2, name: 'two'}, {id: 1, name: 'one'}]

const ids = arr.map(o => o.name)
const filtered = arr.filter(({name}, index) => !ids.includes(name, index + 1))
length = filtered.length;
console.log(length);
console.log(filtered);