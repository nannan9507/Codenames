<template>
	<div class="stop" v-show="isEnd"></div>
	<h3 v-show="hideTeamAdd">是否有白队: <input type="checkbox" v-on:click="addWhiteTeam"/></h3>
	<h3>IN TURN: {{ nowTeam }}队</h3>
	
	<div class="search-and-add">
		<input type="text" v-model="word" @keyup.enter="checkAndAdd" />
		<input type="number" v-model="number" />
		<button v-on:click="checkAndAdd">提示</button>
		<p v-for="tip in tipList">{{ tip.word }}：{{ tip.number }}</p>
	</div>

	<div class="map">
		<div class="block" v-for="item in list" v-on:click="show(item)" :class="{ 'active': item.isShow }">
			{{ item.word }}
			<div class="hidden" :class="{ 'blue': item.team === 'blue', 'red': item.team === 'red', 'white': item.team === 'white', 'black': item.team === 'black' }"></div>
		</div>
	</div>

	<div class="captain-map" v-on:click="this.isHideCaptainMap = false" v-show="isHideCaptainMap" :style="{ border: '2px solid ' + this.mapTeam }">
		<div class="block" v-for="item in list" :style="{ background: item.team }">{{ item.color }}</div>
	</div>

	<h3><button v-on:click="handBoom">手动爆炸</button> <button v-on:click="changeTeam">手动结束</button></h3>
</template>

<script>
	import tools from './tools.js'

	export default {
		data() {
			return {
				isEnd: false,
				lock: true,
				word: '',
				number: 1,
				hideTeamAdd: true,
				isHideCaptainMap: true,
				info: tools.getTeamWords(),
				list: [],
				tipList: [],
				mapTeam: '',
				flag: {
					red: 0,
					blue: 0,
					white: 0,
					black: 0
				},
				nowTeam: '',
				team: [],
				nowIndex: 0
			}
		},
		ready() {
			this.list = this.info.list;
			this.mapTeam = this.info.team;
			this.nowTeam = this.info.team;

			// this.team
			if (this.nowTeam === 'red') {
				this.team.push({ team: 'red', supply: 1 });
				this.team.push({ team: 'blue', supply: 1 });
			} else if(this.nowTeam === 'blue') {
				this.team.push({ team: 'blue', supply: 1 });
				this.team.push({ team: 'red', supply: 1 });
			}

			// this.nowIndex
			for (var i = 0; i < this.team.length; i++) {
				if (this.team[i].team === this.nowTeam) {
					this.nowIndex = i;
				}
			}

		},
		methods: {
			changeTeam() {
				this.nowIndex = this.nowIndex + 1;
				if (this.nowIndex >= this.team.length) {
					this.nowIndex = 0;
					this.nowTeam = this.team[this.nowIndex].team
				} else {
					this.nowTeam = this.team[this.nowIndex].team
				}
				this.lock = true;
			},
			show(item) {
				const findTeam = (_team) => {
					for (let i = 0; i < this.team.length; i++) {
						if (this.team[i].team === _team) {
							return this.team[i];
						}
					}
				}

				const isEnd = () => {
					var end = false;

					if (item.team === 'black') {
						alert('游戏结束,' + this.nowTeam + '队失败');
						this.isEnd = true;
						end = true;
					} else {
						if (this.flag[item.team] === this.info.number[item.team]) {
							alert(`游戏结束, ${item.team}队胜利`);
							this.isEnd = true;
							end = true;
						}
					}

					return end;
				}

				if (this.lock) {
					return alert('您还没有提示信息，拒绝猜词');
				}
				// 未开格子才做处理
				if (!item.isShow) {
					if (window.confirm('确认选择吗?')) {
						// 开始游戏隐藏添加按钮
						this.hideTeamAdd = false;


						// 变色
						const index = this.list.indexOf(item);
						let _item = Object.assign({}, item);
						_item.isShow = true;
						this.list.$set(index, _item);

						// 检测数量是否达到
						this.flag[item.team] = this.flag[item.team] + 1;
						if (!isEnd()) {
							if (item.team !== this.nowTeam) {
								return this.changeTeam();
							}

							this.tipList[this.tipList.length - 1].number--;

							if (this.tipList[this.tipList.length - 1].number === 0) {
								if (findTeam(this.nowTeam).supply) {
									if (!confirm('您猜对了，但是次数用完了，是否补词')) {
										return this.changeTeam()
									}
								} else {
									return this.changeTeam();
								}
							}
						}
						
					}
				}
				// end if
			},
			addWhiteTeam() {
				this.team.push({ team: 'white', supply: 1});
				this.hideTeamAdd = false;
			},
			checkAndAdd() {
				this.hideTeamAdd = false;

				if (this.word === '' || this.number === 0) {
					return alert('提示错误');
				}

				function getWordFromList(list) {
					let str = '';
					for (let item of list) {
						if (!item.isShow) {
							str = str + item.word;
						}
					}
					return str;
				}

				var str = getWordFromList(this.list);

				var flag = 0;
				for (var i in str) {
					for (var j in this.word) {
						if (str[i] == this.word[j]) {
							flag = 1;
						}
					}
				}

				if (flag) {
					this.word = '';
					this.number = 1;
					this.changeTeam();
					return alert('boom shakalaka');
				} else {
					this.tipList.push({ 'word': this.word, 'number': this.number });
					this.word = '';
					this.number = 1;
					this.lock = false;
				}
			},
			handBoom() {
				alert('boom shakalaka');
				this.word = '';
				this.number = 1;
				this.lock = false;
				this.tipList.splice(this.tipList.length - 1, 1);
				return this.changeTeam();
			},
		}
	}
</script>

<style>
	h3 {
		text-align: center;
	}

	.stop {
		width: 100%;
		height: 100%;
		position: absolute;
		z-index: 3;
	}

	.map {
		width: 600px;
		height: 600px;
		border: 1px solid #666;
		margin: 0 auto;
		overflow: hidden;
	}
	.map .block {
		position: relative;
		float: left;
		box-sizing: border-box;
		width: 120px;
		height: 120px;
		border: 1px solid #000;
		text-align: center;
		line-height: 120px;
		cursor: pointer;
		font-weight: bold;
		font-size: 24px;
	}
	.map .block.active {
		float: left;
		box-sizing: border-box;
		width: 120px;
		height: 120px;
		border: 1px solid #000;
		text-align: center;
		line-height: 120px;
		background: red;
	}
	.map .block .hidden {
		display: hidden;
	}
	.map .block.active .hidden{
		position: absolute;
		top: 0;
		left: 0;
		width: 118px;
		height: 118px;
		text-align: center;
		line-height: 120px;
		content: '';
	}

	.captain-map {
		position: absolute;
		top: 0;
		left: 0;
		width: 250px;
		height: 250px;
		background: #999;
	}
	.captain-map .block {
		float: left;
		width: 50px;
		height: 50px;
		overflow: hidden;
		border: 1px solid #000;
		box-sizing: border-box;
	}

	.red {
		background: red;
	}

	.blue {
		background: blue;
	}

	.white {
		background: white;
	}

	.black {
		background: black;
	}

	.search-and-add {
		position: absolute;
		top: 0px;
		left: 0px;
	}
</style>