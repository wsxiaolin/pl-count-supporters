const config = {
  sort: 1, // 1为热门 2为时间
  Take: 3, // 读取作品的数量1－100
  Days: 30, // 读取n天内的作品
  Tags: [],
};

const Pl = require("physics-lab-web-api");
const User = Pl.User;
const map = new Map();

async function main() {
  const pl = new User(null, null);
  await pl.auth.login();
  const re = await pl.projects.query("Discussion", config);

  for (const i of re.Data.$values) {
    const getSupporters = await pl.projects.getSupporters(
      i.ID,
      "Discussion",
      50
    );
    const users = getSupporters.Data.$values;
    users.map((user) => {
      user.ID = user.Nickname;
      if (map.has(user.ID)) {
        map.set(user.ID, map.get(user.ID) + 1);
      } else {
        map.set(user.ID, 1);
      }
    });
  }

  console.table([...map].sort((a, b) => -a[1] + b[1]));
}
main();
