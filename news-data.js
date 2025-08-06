const newsData=
[
  { "date": "2025-07-29", "title": "建置技能模擬器" },
  { "date": "2025-08-10", "title": "更新弓箭部技能資料" },
  { "date": "未來-00-00", "title": "氣功部資料" }
]

const list = document.getElementById('news-list');
newsData.forEach(item => {
  const li = document.createElement('li');
  li.textContent = `${item.date} ${item.title}`;
  list.appendChild(li);
});