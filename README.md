# Website incremental game
is a project i made using Vite, React, TypeScript, TailWind. Published it with github pages (Github actions).

### How to play:
Open the game [website](https://d9m9nt9d.github.io/incremental-2/).<br/>
On the left side you should see your currencies, like <img height="20px" src="src/assets/money.svg" alt="Money icon" align="absmiddle"/>money, gems, and testing menu that i forgot to remove.<br/><br/>
<img height="240px" src="src/assets/showcase/gs-leftside.png" alt="Image of the left side of the website"/><br/><br/>
In the middle you should see upgrades, the main part of the game<br/><br/>
<img height="240px" src="src/assets/showcase/gs-middle.png" alt="Image of the middle of the website"/><br/><br/>
you buy those upgrades to boost your currencies gain, like every incremental game.<br/>
> [!NOTE]
> To buy an upgrade click the lowest rectangle where the cost is displayed.<br/><br/>
> <img height="200px" src="src/assets/showcase/gs-upg.webp" alt="Image of an upgrade"/>

> [!TIP]
> Right click to buy maximum amount of levels you can afford.<br/>

There isn't much content yet as it's my first time using Vite, React and other stuff.
<br/><br/><br/>
### How it works:
Currencies is a dictionary where each key is the currency name and the value is the currency properties.<br/>
All currencies have:
- Icon: image of the currency
- ClassName: style of the currency
- Base: How much should currency increment when addCurrency is called
- Multis: Multiplies the base
- ActiveMultis: Also multiplies the base, the difference is that Multis is a single number, while ActiveMultis is a dictionary where each key is a string and each value is a constantly changing number
- Per: Base multiplied by Multis multiplied by each value in ActiveMultis
- Value: How much of this currency you currently have

<br/><br/>

Upgrades are a dictionary where each key is the id and value is the upgrade properties.<br/>
Each upgrade has:
- Label
- Requirements
- Levels

<br/><br/>

Each level can have:
- Description
- Cost
- CostLabel: optional, overrides cost
- Check: optional, function that returns true or false, and if its false you can't buy the upgrade
- OnBought: required function that has two parameters: loaded and level. Loaded is true if the upgrade wasn't bought but reloaded (for example when you reload the page).
