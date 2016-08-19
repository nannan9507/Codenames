import list from './words.js'

function Map() {
	this.number = {};
	this.list = [];
	this.team = Math.random() <= 0.5 ? 'red' : 'blue';
	this.getNumber = function getNumber() {
		this.number[this.team] = 9;
		if (this.team === 'red') {
			this.number['blue'] = 8;
		} else {
			this.number['red'] = 8;
		}
		this.number['white'] = 7;
		this.number['black'] = 1;
	}
}

function Word(word, team) {
	this.word = word;
	this.team = team;
}

function getWordList(list) {
	let arr = []

	const set = new Set();

	while (set.size !== 25) {
		set.add(Math.floor(Math.random() * list.length));
	}

	for (let item of set) {
		arr.push(list[item]);
	}

	return arr;
}

function upsetArray(list) {
 var _arr = [];
  for (let i = 0; i < list.length; i++) {
    _arr[i] = i;
  }
  _arr.sort(function () { return 0.5 - Math.random() });
  
  var arr = [];
  for (let i = 0; i < _arr.length; i++) {
  	arr.push(list[_arr[i]]);
  }
  
  return arr;
}

function getTeamWords() {
	const arr = getWordList(list)
	let _arr = [];

	const map = new Map()
	map.getNumber()

	let teams_flag = [];

	for (let color in map.number) {
		if (map.number[color] !== 0) {
			for (let i = 0; i < map.number[color]; i++) {
				teams_flag.push(color);
			}
		}
	}

	// 打乱数组, 获得队伍编号
	teams_flag = upsetArray(teams_flag);

	for (let i = 0; i < arr.length; i++) {
		_arr.push(new Word(arr[i], teams_flag[i]))
	}

	map.list = _arr;

	return map;
}

export default {
	getTeamWords: getTeamWords
};