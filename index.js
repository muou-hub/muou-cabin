
const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".pages");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
	// 移除所有 active 樣式
	tabs.forEach(t => t.classList.remove("active"));
	panels.forEach(p => p.classList.remove("active"));

	// 新增 active 樣式
	tab.classList.add("active");
	const target = tab.getAttribute("page");
	document.getElementById(target).classList.add("active");
  });
});
	
const maxPoints = 100;
let maxAgi =0;
let maxStr =0;
let maxInt =0;
let usedPoints = 0;

const originalSkills = JSON.parse(JSON.stringify(skills)); 
function renderSkills() {
    const agilist = document.getElementById('agiList');
    const strlist = document.getElementById('strList');
    const intlist = document.getElementById('intList');
    const comlist = document.getElementById('comList');
    agilist.innerHTML = '';
    strlist.innerHTML = '';
    intlist.innerHTML = '';
    comlist.innerHTML = '';

    skills.forEach((skill, index) => {
        const div = document.createElement('div');
        div.className = 'skill';
        div.setAttribute('data-rank', skill.rank);
        div.setAttribute('data-max', skill.max);
        div.setAttribute('data-name', skill.name);
        div.setAttribute('data-id', skill.id);

        if (skill.type === "Agi") {
            agilist.appendChild(div);
        } else if (skill.type === "Str") {
            strlist.appendChild(div);
        } else if (skill.type === "Int") {
            intlist.appendChild(div);
        } else if (skill.type === "Com") {
            comlist.appendChild(div);
        }

        div.innerHTML = 
		`
			<div class="icon ${skill.rank > 0 ? 'highlight' : ''}"style="background-image: url('${skill.url}')"> </div>
			<div class="info ${skill.rank > 0 ? 'highlight' : ''}">
				${skill.rank < skill.max
				?`<span ${getGo(skill.needid,skill.ranks[skill.rank].needlv)}>${skill.name} Lv.${skill.rank}</span>`
				:`<span ${getGo(skill.needid,skill.ranks[skill.rank-1].needlv)}>${skill.name}</span>`}
				<small style="display:block ">
				${skill.rank== skill.max 
				?`${skill.level} -Master`:`${skill.level} -下級需求點:${skill.ranks[skill.rank].cost}`}
				</small>
			</div>
			<div class="controls">
				${(skill.rank == 0) 
				? `<button class="btnlearn" onclick="addRank(${index})">學習</button>`:''}
				${(skill.rank > 0 &&skill.rank < skill.max )
				?`<button class="plus" onclick="addRank(${index})">▲</button>`:''}
			</div>
			<div id="curr-${skill.id}" class="box" >
				<div style='color:#6eddaa;text-align:center;'>${skill.rank == 0 ? '' : (skill.rank == skill.max ? 'Master' : `當前級別Lv.${skill.rank}`)}</div>
				<div style='color:#70b9dc;text-align:center;'>▼基本資料▼</div>
				<div style='color:#6eddaa;text-align:center;'>名稱：${skill.name}</div>
				<div style='color:#6eddaa;text-align:center;'>級別：${skill.ball}</div>
				<div style='color:#6eddaa;text-align:center;'>職業：${skill.proNM}</div>
				${skill.rank == 0 
				?`	${skill.ranks[skill.rank].distance
					? `<div style='color:#FFFFFF;text-align:center;'>目標可行距離：${skill.ranks[skill.rank].distance}</div>`:''}`
				:`
					${skill.ranks[skill.rank-1].distance
					? `<div style='color:#FFFFFF;text-align:center;'>目標可行距離：${skill.ranks[skill.rank-1].distance}</div>`:''}`
				}
				<div style='color:#70b9dc;text-align:center;'>▼使用道具▼</div>
				<div style='color:#FFFFFF;text-align:center;'>使用主工具：${skill.equipment}</div>
				${
				  skill.rank == 0
					? ` <div style='color:#70b9dc;text-align:center;'>▼升級條件▼</div>
						${skill.needid
						?`<div ${getGo(skill.needid,skill.ranks[skill.rank].needlv)}>技能：${getNeedSkillNM(skill.needid)}</div>
						  <div  ${getGo(skill.needid,skill.ranks[skill.rank].needlv)}>技能等級：${skill.ranks[skill.rank].needlv}`:''}
						${skill.ranks[skill.rank].cost >0 
						?`<div style='color:#FFFFFF;text-align:center;'>技能點數：${skill.ranks[skill.rank].cost}</div>`:''}
						<div style='color:#FFFFFF;text-align:center;'>角色等級：${skill.ranks[skill.rank].lv}</div>
						${skill.ranks[skill.rank].agipoint 
						?`<div style='color:#FFFFFF;text-align:center;'>敏捷：${skill.ranks[skill.rank].agipoint}</div>`:''}
						${skill.ranks[skill.rank].strpoint 
						?`<div style='color:#FFFFFF;text-align:center;'>力量：${skill.ranks[skill.rank].strpoint}</div>`:''}
						${skill.ranks[skill.rank].intpoint 
						?`<div style='color:#FFFFFF;text-align:center;'>精神：${skill.ranks[skill.rank].intpoint}</div>`:''}
						`
					: ` <div style='color:#70b9dc;text-align:center;'>▼基本數值▼</div>
						${skill.ranks[skill.rank-1].delay
						?` <div style='color:#FFFFFF;text-align:center;'>延遲：${(skill.ranks[skill.rank - 1].delay).toFixed(1)}</div>`:''}
						${skill.ranks[skill.rank-1].keep
						?`<div style='color:#FFFFFF;text-align:center;'>持續時間：${(skill.ranks[skill.rank-1].keep).toFixed(1)}</div>`:''}
						${skill.ranks[skill.rank-1].range
						?`<div style='color:#FFFFFF;text-align:center;'>適用範圍：${skill.ranks[skill.rank-1].range}</div>`:''}
						${skill.ranks[skill.rank-1].cnt
						?`<div style='color:#FFFFFF;text-align:center;'>適用數量：${skill.ranks[skill.rank-1].cnt}</div>`:''}
						${skill.ranks[skill.rank-1].angle
						?`<div style='color:#FFFFFF;text-align:center;'>適用角度：${skill.ranks[skill.rank-1].angle}</div>`:''}
						${skill.ranks[skill.rank-1].pass
						?`<div style='color:#FFFFFF;text-align:center;'>貫穿程度：${skill.ranks[skill.rank-1].pass}</div>`:''}
						${skill.ranks[skill.rank-1].hp
						?`<div style='color:#FFFFFF;text-align:center;'>HP變化：${(skill.ranks[skill.rank-1].hp).toFixed(1)}</div>`:''}
						${skill.ranks[skill.rank-1].miss
						?`<div style='color:#FFFFFF;text-align:center;'>迴避率變化量：${(skill.ranks[skill.rank-1].miss).toFixed(1)}</div>`:''}
						${skill.ranks[skill.rank-1].mpv
						?`<div style='color:#FFFFFF;text-align:center;'>魔力值：${(skill.ranks[skill.rank-1].mpv).toFixed(1)}</div>`:''}
						${skill.ranks[skill.rank-1].defense
						?`<div style='color:#FFFFFF;text-align:center;'>防禦值變化：${(skill.ranks[skill.rank-1].defense).toFixed(1)}</div>`:''}
						${skill.ranks[skill.rank-1].hit
						?`<div style='color:#FFFFFF;text-align:center;'>命中率變化：${(skill.ranks[skill.rank-1].hit).toFixed(1)}</div>`:''}
						${skill.ranks[skill.rank-1].target
						?`<div style='color:#FFFFFF;text-align:center;'>目標數量：${skill.ranks[skill.rank-1].target}</div>`:''}
						
						${(skill.ranks[skill.rank-1].arrow|| skill.ranks[skill.rank-1].mp||skill.ranks[skill.rank-1].sp ||skill.ranks[skill.rank-1].hpd)
						?`<div style='color:#70b9dc;text-align:center;'>▼使用時消耗量▼</div>`:''}
						${skill.ranks[skill.rank-1].arrow 
						?`<div style='color:#FFFFFF;text-align:center;'>消耗箭數：${skill.ranks[skill.rank-1].arrow}</div>`:''}
						${skill.ranks[skill.rank-1].hpd
						?`<div style='color:#FFFFFF;text-align:center;'>HP消耗量：${skill.ranks[skill.rank-1].hpd}</div>`:''}
						${skill.ranks[skill.rank-1].mp
						?`<div style='color:#FFFFFF;text-align:center;'>MP消耗量：${skill.ranks[skill.rank-1].mp}</div>`:''}
						${skill.ranks[skill.rank-1].sp
						?`<div style='color:#FFFFFF;text-align:center;'>SP消耗量：${skill.ranks[skill.rank-1].sp}</div>`:''}
						
						${(skill.ranks[skill.rank-1].paradc || skill.ranks[skill.rank-1].paradr || skill.ranks[skill.rank-1].stopc)
						?`<div style='color:#70b9dc;text-align:center;'>▼狀態異常▼</div>`:''}
						${skill.ranks[skill.rank-1].paradc 
						?`<div style='color:#ffe955;text-align:center;'>麻痺</div>
						<div style='color:#ffe955;text-align:center;'>發生機率：${(skill.ranks[skill.rank-1].paradc*100).toFixed(1)}</div>`:''}
						${skill.ranks[skill.rank-1].paradr 
						?`<div style='color:#ffe955;text-align:center;'>延遲變化率：${skill.ranks[skill.rank-1].paradr}</div>`:''}
						${skill.ranks[skill.rank-1].stopc 
						?`<div style='color:#ffe955;text-align:center;'>昏厥</div>
						  <div style='color:#ffe955;text-align:center;'>發生機率：${(skill.ranks[skill.rank-1].stopc*100).toFixed(1)}</div>`:''}
						
						${(skill.ranks[skill.rank-1].pulld ||skill.ranks[skill.rank-1].pullc)
						?`<div style='color:#70b9dc;text-align:center;'>▼特殊效果▼</div>
						  <div style='color:#ffe955;text-align:center;'>功能：推/拉`:''}
						${skill.ranks[skill.rank-1].pulld
						?`<div style='color:#ffe955;text-align:center;'>距離：${(skill.ranks[skill.rank-1].pulld).toFixed(2)}</div>`:''}
						${skill.ranks[skill.rank-1].pullc
						?`<div style='color:#ffe955;text-align:center;'>機率：${(skill.ranks[skill.rank-1].pullc*100).toFixed(1)}%</div>`:''}		
						${skill.ranks[skill.rank-1].passadd
						?`<div style='color:#70b9dc;text-align:center;'>▼特殊效果▼</div>
						  <div style='color:#ffe955;text-align:center;'>功能：貫穿程度`:''}
						${skill.ranks[skill.rank-1].passadd
						?`<div style='color:#ffe955;text-align:center;'>貫穿增加：${skill.ranks[skill.rank-1].passadd}</div>`:''}
						${(skill.ranks[skill.rank-1].speed || skill.ranks[skill.rank-1].speedd || skill.ranks[skill.rank-1].speedc)
						?`<div style='color:#70b9dc;text-align:center;'>▼特殊效果▼</div>
						  <div style='color:#ffe955;text-align:center;'>功能：移動速度`:''}
						${skill.ranks[skill.rank-1].speed
						?`<div style='color:#ffe955;text-align:center;'>離速率：${(skill.ranks[skill.rank-1].speed*100).toFixed(2)}%</div>`:''}
						${skill.ranks[skill.rank-1].speedd
						?`<div style='color:#ffe955;text-align:center;'>距離：${(skill.ranks[skill.rank-1].speedd*100).toFixed(2)}%</div>`:''}
						${skill.ranks[skill.rank-1].speedc
						?`<div style='color:#ffe955;text-align:center;'>機率：${(skill.ranks[skill.rank-1].speedc*100).toFixed(1)}%</div>`:''}
						${skill.ranks[skill.rank-1].getb
						?`<div style='color:#70b9dc;text-align:center;'>▼特殊效果▼</div>
						  <div style='color:#ffe955;text-align:center;'>功能：奪取HP`:''}
						${skill.ranks[skill.rank-1].getb
						?`<div style='color:#ffe955;text-align:center;'>吸收率：${(skill.ranks[skill.rank-1].getb*100).toFixed(2)}%</div>`:''}  
						${skill.ranks[skill.rank-1].shootv
						?`<div style='color:#70b9dc;text-align:center;'>▼特殊效果▼</div>
						  <div style='color:#ffe955;text-align:center;'>功能：射程距離`:''}
						${skill.ranks[skill.rank-1].shootv
						?`<div style='color:#ffe955;text-align:center;'>攻擊距離：${(skill.ranks[skill.rank-1].shootv).toFixed(2)}</div>`:''}  
						  
						${(skill.ranks[skill.rank-1].defenser || skill.ranks[skill.rank-1].attackr || skill.ranks[skill.rank-1].mpr )
						?`<div style='color:#70b9dc;text-align:center;'>▼附加效果▼</div>`:''}
						${skill.ranks[skill.rank-1].attackr
						?`<div style='color:#ffe955;text-align:center;'>攻擊值變化率：${(skill.ranks[skill.rank - 1].attackr * 100).toFixed(2)}%</div>`:''}
						${skill.ranks[skill.rank-1].defenser
						?`<div style='color:#ffe955;text-align:center;'>防禦值變化率：${(skill.ranks[skill.rank-1].defenser*100).toFixed(2)}%</div>`:''}
						${skill.ranks[skill.rank-1].mpr
						?`<div style='color:#ffe955;text-align:center;'>MP變化率：${(skill.ranks[skill.rank-1].mpr*100).toFixed(2)}%</div>`:''}
						`
				}
				<div style='color:#70b9dc;text-align:center;'>▼說明▼</div>
				<div style='color:#FFFFFF;text-align:center;'>${skill.detail}</div>
			</div>
			</div>
			<div id="next-${skill.id}" class="box box-right">
				${(skill.rank>0 &&skill.rank < skill.max)
				?`
					<div style='color:#CE0000;text-align:center;'>下一級別Lv.${skill.rank+1}</div>
					<div style='color:#70b9dc;text-align:center;'>▼基本資料▼</div>
					<div style='color:#6eddaa;text-align:center;'>名稱：${skill.name}</div>
					<div style='color:#6eddaa;text-align:center;'>級別：${skill.ball}</div>
					<div style='color:#6eddaa;text-align:center;'>職業：${skill.proNM}</div>
					${skill.ranks[skill.rank].distance
					?`<div style='color:#FFFFFF;text-align:center;'>目標可行距離：${skill.ranks[skill.rank].distance}</div>`:''}
					<div style='color:#70b9dc;text-align:center;'>▼使用道具▼</div>
					<div style='color:#FFFFFF;text-align:center;'>使用主工具：${skill.equipment}</div>
					
					<div style='color:#70b9dc;text-align:center;'>▼基本數值▼</div>
					${skill.ranks[skill.rank].delay
					?`<div style='color:#FFFFFF;text-align:center;'>延遲：${(skill.ranks[skill.rank].delay).toFixed(1)}</div>`:''}
					${skill.ranks[skill.rank].keep
					?`<div style='color:#FFFFFF;text-align:center;'>持續時間：${(skill.ranks[skill.rank].keep).toFixed(1)}</div>`:''}
					${skill.ranks[skill.rank].range
					?`<div style='color:#FFFFFF;text-align:center;'>適用範圍：${skill.ranks[skill.rank].range}</div>`:''}
					${skill.ranks[skill.rank].cnt
					?`<div style='color:#FFFFFF;text-align:center;'>適用數量：${skill.ranks[skill.rank].cnt}</div>`:''}
					${skill.ranks[skill.rank].angle
					?`<div style='color:#FFFFFF;text-align:center;'>適用角度：${skill.ranks[skill.rank].angle}</div>`:''}
					${skill.ranks[skill.rank].pass
					?`<div style='color:#FFFFFF;text-align:center;'>貫穿程度：${skill.ranks[skill.rank].pass}</div>`:''}
					${skill.ranks[skill.rank].hp
					?`<div style='color:#FFFFFF;text-align:center;'>HP變化：${(skill.ranks[skill.rank].hp).toFixed(1)}</div>`:''}
					${skill.ranks[skill.rank].miss
					?`<div style='color:#FFFFFF;text-align:center;'>迴避率變化量：${(skill.ranks[skill.rank].miss).toFixed(1)}</div>`:''}
					${skill.ranks[skill.rank].mpv
					?`<div style='color:#FFFFFF;text-align:center;'>魔力值：${(skill.ranks[skill.rank].mpv).toFixed(1)}</div>`:''}
					${skill.ranks[skill.rank].defense
					?`<div style='color:#FFFFFF;text-align:center;'>防禦值變化：${(skill.ranks[skill.rank].defense).toFixed(1)}</div>`:''}
					${skill.ranks[skill.rank].hit
					?`<div style='color:#FFFFFF;text-align:center;'>命中率變化：${(skill.ranks[skill.rank].hit).toFixed(1)}</div>`:''}
					${skill.ranks[skill.rank].target
					?`<div style='color:#FFFFFF;text-align:center;'>目標數量：${skill.ranks[skill.rank].target}</div>`:''}
					
					${(skill.ranks[skill.rank].arrow || skill.ranks[skill.rank].mp ||skill.ranks[skill.rank].sp ||skill.ranks[skill.rank].hpd)
					?`<div style='color:#70b9dc;text-align:center;'>▼使用時消耗量▼</div>`:''}
					${skill.ranks[skill.rank].arrow 
					?`<div style='color:#FFFFFF;text-align:center;'>消耗箭數：${skill.ranks[skill.rank].arrow}</div>`:''}
					${skill.ranks[skill.rank].hpd
					?`<div style='color:#FFFFFF;text-align:center;'>HP消耗量：${skill.ranks[skill.rank].hpd}</div>`:''}
					${skill.ranks[skill.rank].mp
					?`<div style='color:#FFFFFF;text-align:center;'>MP消耗量：${skill.ranks[skill.rank].mp}</div>`:''}
					${skill.ranks[skill.rank].sp
					?`<div style='color:#FFFFFF;text-align:center;'>SP消耗量：${skill.ranks[skill.rank].sp}</div>`:''}
					
					${(skill.ranks[skill.rank].paradc || skill.ranks[skill.rank].paradr ||  skill.ranks[skill.rank].stopc)
					?`<div style='color:#70b9dc;text-align:center;'>▼狀態異常▼</div>`:''}
					${skill.ranks[skill.rank].paradc 
					?`<div style='color:#ffe955;text-align:center;'>麻痺</div>
					<div style='color:#ffe955;text-align:center;'>發生機率：${(skill.ranks[skill.rank].paradc*100).toFixed(1)}</div>`:''}
					${skill.ranks[skill.rank].paradr 
					?`<div style='color:#ffe955;text-align:center;'>延遲變化率：${skill.ranks[skill.rank].paradr}</div>`:''}
					${skill.ranks[skill.rank].stopc 
					?`<div style='color:#ffe955;text-align:center;'>昏厥</div>
					  <div style='color:#ffe955;text-align:center;'>發生機率：${(skill.ranks[skill.rank].stopc*100).toFixed(1)}</div>`:''}
								
					${(skill.ranks[skill.rank].pulld || skill.ranks[skill.rank].pullc)
					?`<div style='color:#70b9dc;text-align:center;'>▼特殊效果▼</div>
					  <div style='color:#ffe955;text-align:center;'>功能：推/拉`:''}
					${skill.ranks[skill.rank].pulld
					?`<div style='color:#ffe955;text-align:center;'>距離：${(skill.ranks[skill.rank].pulld).toFixed(2)}</div>`:''}
					${skill.ranks[skill.rank].pullc
					?`<div style='color:#ffe955;text-align:center;'>機率：${(skill.ranks[skill.rank].pullc*100).toFixed(1)}%</div>`:''}		
					${skill.ranks[skill.rank].passadd
					?`<div style='color:#70b9dc;text-align:center;'>▼特殊效果▼</div>
					  <div style='color:#ffe955;text-align:center;'>功能：貫穿程度`:''}
					${skill.ranks[skill.rank].passadd
					?`<div style='color:#ffe955;text-align:center;'>貫穿增加：${skill.ranks[skill.rank].passadd}</div>`:''}
					${(skill.ranks[skill.rank].speed || skill.ranks[skill.rank].speedd || skill.ranks[skill.rank].speedc)
					?`<div style='color:#70b9dc;text-align:center;'>▼特殊效果▼</div>
					  <div style='color:#ffe955;text-align:center;'>功能：移動速度`:''}
					${skill.ranks[skill.rank].speed
					?`<div style='color:#ffe955;text-align:center;'>離速率：${(skill.ranks[skill.rank].speed*100).toFixed(2)}%</div>`:''}
					${skill.ranks[skill.rank].speedd
					?`<div style='color:#ffe955;text-align:center;'>距離：${(skill.ranks[skill.rank].speedd*100).toFixed(2)}%</div>`:''}
					${skill.ranks[skill.rank].speedc
					?`<div style='color:#ffe955;text-align:center;'>機率：${(skill.ranks[skill.rank].speedc*100).toFixed(1)}%</div>`:''}
					${(skill.ranks[skill.rank].getb)
					?`<div style='color:#70b9dc;text-align:center;'>▼特殊效果▼</div>
					  <div style='color:#ffe955;text-align:center;'>功能：奪取HP`:''}
					${skill.ranks[skill.rank].getb
					?`<div style='color:#ffe955;text-align:center;'>吸收率：${(skill.ranks[skill.rank].getb*100).toFixed(2)}%</div>`:''}
					${skill.ranks[skill.rank].shootv
					?`<div style='color:#70b9dc;text-align:center;'>▼特殊效果▼</div>
					  <div style='color:#ffe955;text-align:center;'>功能：射程距離`:''}
					${skill.ranks[skill.rank].shootv
					?`<div style='color:#ffe955;text-align:center;'>攻擊距離：${(skill.ranks[skill.rank].shootv).toFixed(2)}</div>`:''} 
					
					${(skill.ranks[skill.rank].defenser || skill.ranks[skill.rank].attackr || skill.ranks[skill.rank].mpr)
					?`<div style='color:#70b9dc;text-align:center;'>▼附加效果▼</div>`:''}
					${skill.ranks[skill.rank].attackr
					?`<div style='color:#ffe955;text-align:center;'>攻擊值變化率：${(skill.ranks[skill.rank].attackr*100).toFixed(2)}%</div>`:''}
					${skill.ranks[skill.rank].defenser
					?`<div style='color:#ffe955;text-align:center;'>防禦值變化率：${(skill.ranks[skill.rank].defenser*100).toFixed(2)}%</div>`:''}
					${skill.ranks[skill.rank].mpr
					?`<div style='color:#ffe955;text-align:center;'>MP變化率：${(skill.ranks[skill.rank].mpr*100).toFixed(2)}%</div>`:''}
					
					<div style='color:#70b9dc;text-align:center;'>▼升級條件▼</div>
					${(skill.needid)
					?`<div  ${getGo(skill.needid,skill.ranks[skill.rank].needlv)}>技能：${getNeedSkillNM(skill.needid)}</div>
					  <div  ${getGo(skill.needid,skill.ranks[skill.rank].needlv)}>技能等級：${skill.ranks[skill.rank].needlv}`:''}
					<div style='color:#FFFFFF;text-align:center;'>技能點數：${skill.ranks[skill.rank].cost}</div>
					<div style='color:#FFFFFF;text-align:center;'>角色等級：${skill.ranks[skill.rank].lv}</div>
					${skill.ranks[skill.rank].agipoint?`<div style='color:#FFFFFF;text-align:center;'>敏捷：${skill.ranks[skill.rank].agipoint}</div>`:''}
					${skill.ranks[skill.rank].strpoint?`<div style='color:#FFFFFF;text-align:center;'>力量：${skill.ranks[skill.rank].strpoint}</div>`:''}
					${skill.ranks[skill.rank].intpoint?`<div style='color:#FFFFFF;text-align:center;'>精神：${skill.ranks[skill.rank].intpoint}</div>`:''}
				`
				:''}
			</div>
		`;
        document.getElementById('uesedpoints').innerText = usedPoints;
		findMaxPointByType();
		
		document.getElementById('maxagi').innerText = maxAgi;
        document.getElementById('maxstr').innerText = maxStr;
        document.getElementById('maxint').innerText = maxInt;
    });
};
renderSkills();
//紀錄最高的能力點
function findMaxPointByType(){
	 skills.forEach(ss => {
		 if(ss.rank >0 && ss.rank < ss.max){
			 const i =ss.rank-1;
			 if(ss.ranks[i].agipoint){
				 maxAgi=( ss.ranks[i].agipoint > maxAgi) ? ss.ranks[i].agipoint : maxAgi;
			 };
			 if(ss.ranks[i].strpoint){
				 maxStr=( ss.ranks[i].strpoint > maxStr) ? ss.ranks[i].strpoint : maxStr;
			 };
			 if(ss.ranks[i].intpoint){
				 maxInt=( ss.ranks[i].intpoint > maxInt) ? ss.ranks[i].intpoint : maxInt;
			 };
		 }
	});
	return;
}

//取得前置名稱
function getNeedSkillNM(needid) {
  const needed = skills.find(s => s.id === needid);
  if(needed.name){return needed.name;}
  return needid;
}
//判斷前置達成否樣式
function getGo(needid,needlv){
	const needed = skills.find(s => s.id === needid);
	let result ="style='color:#FFFFFF;text-align:center;'";
	if(needid!=null){
		result ="style='color:#CE0000;text-align:center;'";
	}
	if(needed){
		if(needed.rank >= needlv){
			result ="style='color:#FFFFFF;text-align:center;'";
		}
	}
	return result;
}

//reset
function reset(){
	usedPoints=0;
	maxAgi=0;maxStr=0;maxInt=0;
	skills = JSON.parse(JSON.stringify(originalSkills));
	renderSkills();
}
//Rank增加減少
function addRank(index) {
    const skill = skills[index];
	//200等以前才可以使用
	if(skill.ranks[skill.rank].needlv >200 || skill.ranks[skill.rank].lv >200){
		alert('目前僅記錄到Lv200以內的技能');
		return;
	}
    const newRank = skill.rank+1;
	
	//判斷前置
	if(skill.needid && skill.ranks[skill.rank].needlv){
		const needed = skills.find(s => s.id === skill.needid);
		if(needed.rank<skill.ranks[skill.rank].needlv){
		console.log(`${`前置目前等級：${needed.rank} 需達：${skills[index].ranks[skill.rank].needlv}`}`);
		return;}
	}

	usedPoints = usedPoints+(skill.ranks[skill.rank].cost);

    skill.rank = newRank;
    renderSkills();
	
	document.querySelectorAll('.plus').forEach(btn => {
		btn.addEventListener('click', (e) => {
		const currtip = document.getElementById(`curr-${skill.id}`);
		const nexttip = document.getElementById(`next-${skill.id}`);

		console.log(`➢ID:${skill.id}-等級：${skill.rank}`);
	 if (currtip) {
			if(skill.rank==0 || skill.rank==skill.max){
			currtip.style.display = 'block';
			nexttip.style.display = 'none';
			
			let height  = currtip.offsetHeight+100;
			let offsetY = window.innerHeight-e.clientY < height ? (height*-1)+100 : 0;
			let offsetX = window.innerWidth-e.clientX < 400 ? -180 : 10;
			currtip.style.left = (e.clientX + offsetX) + 'px';
			currtip.style.top  = (e.clientY + offsetY) + 'px';
			
			}else{
			currtip.style.display = 'block';
			nexttip.style.display = 'block';
			let height  = currtip.offsetHeight;
			let offsetY = window.innerHeight-e.clientY < height ? (height*-1)+100 : 0;
			let offsetX = window.innerWidth-e.clientX < 400 ? -180 : 10;
			currtip.style.left = (e.clientX + offsetX) + 'px';
			nexttip.style.left = (e.clientX + offsetX) + 'px';
			currtip.style.top  = (e.clientY + offsetY) + 'px';
			nexttip.style.top  = (e.clientY + offsetY) + 'px';
			}
		}
	  });
	});
}
document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('keydown', e => {
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
      e.preventDefault();
    }
  });

  
const firebaseConfig = {
  apiKey: "AIzaSyCgSwYinbh9eAm-aiC-htqY4KLuHeZ3cV8",
  authDomain: "realtime-database-49fc3.firebaseapp.com",
  databaseURL: "https://realtime-database-49fc3-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "realtime-database-49fc3"
};
firebase.initializeApp(firebaseConfig);
firebase.auth().signInAnonymously()
  .then(() => {
    const counterRef = firebase.database().ref("visitorCount");
    counterRef.transaction(current => (current || 0) + 1);
    counterRef.on("value", snapshot => {
      const count = snapshot.val();
      document.getElementById("visitor-count").textContent = `⭐ 拜訪次數: ${count}`;
    });
  })
  .catch(error => {
    console.error("錯誤", error);
  });

document.addEventListener('mousemove', e => {
    const sk = e.target.closest('.skill');
	 if (!sk){
		  const elements = e.currentTarget.querySelectorAll('.box')
			elements.forEach(a => {
			  a.style.display = 'none';
			});
		 return;
		 }
	 const elements = e.currentTarget.querySelectorAll('.box')
		elements.forEach(a => {
		  a.style.display = 'none';
		});
    const rank = sk.getAttribute('data-rank');
    const max = sk.getAttribute('data-max');
    const name = sk.getAttribute('data-name');
    const id = sk.getAttribute('data-id');
    const currtip = document.getElementById(`curr-${id}`);
    const nexttip = document.getElementById(`next-${id}`);

   // console.log(`當前➤ID:${id}-${name} 等級：${rank}`);

    if (currtip) {
		if(rank == 0 || rank == max){
		currtip.style.display = 'block';
		nexttip.style.display = 'none';
		let height  = currtip.offsetHeight+100;
		let offsetY = window.innerHeight-e.clientY < height ? (height*-1)+100 : 0;
		let offsetX = window.innerWidth-e.clientX < 400 ? -180 : 10;
		
		currtip.style.left = (e.clientX + offsetX) + 'px';
		currtip.style.top  = (e.clientY + offsetY) + 'px';
		
		}else{
		currtip.style.display = 'block';
        nexttip.style.display = 'block';
		let height  = currtip.offsetHeight;
		let offsetY = window.innerHeight-e.clientY < height ? (height*-1)+100 : 0;
		let offsetX = window.innerWidth-e.clientX < 400 ? -180 : 10;
		currtip.style.left = (e.clientX + offsetX) + 'px';
        nexttip.style.left = (e.clientX + offsetX) + 'px';
        currtip.style.top  = (e.clientY + offsetY) + 'px';
        nexttip.style.top  = (e.clientY + offsetY) + 'px';
		}
    }
});

