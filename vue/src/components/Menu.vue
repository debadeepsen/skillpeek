<template>
  <div id="nav">
    <div>
      <router-link class="logo" to="/">
        <img src="logo7.png" />
      </router-link>
    </div>
    <div>
      <ul>
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/companies">Companies</router-link></li>
        <li><router-link to="/locations">Locations</router-link></li>
        <li><router-link to="/about">About</router-link></li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
#nav {
  padding: 5px 0px;
  box-shadow: 0px 0px 7px #1113;
  display: flex;
  flex-direction: row;
  background: #fff;
  position: fixed;
  width: 100%;
  /* position: sticky; */
  z-index: 200;
}

#nav > div {
  /* border: 1px solid; */
  display: flex;
  flex-grow: 1;
}

#nav > div:nth-child(2) {
  justify-content: flex-end;
}

.logo {
  margin-left: 10px;
}

.logo,
#nav img {
  height: 40px;
  align-self: center;
}

#nav ul {
  display: inline-block;
  margin-right: 10px;
}

#nav li {
  display: inline-block;
  margin-left: 20px;
}

#nav li > a {
  color: tomato;
}

#nav li > a:hover {
  color: tomato;
  /* border-bottom: 2px solid tomato; */
  box-shadow: 0px 2px 0px 0px tomato;
  transition: all 0.2s;
}

#nav li > a.router-link-exact-active {
  /* border-bottom: 2px solid tomato; */
  box-shadow: 0px 2px 0px 0px tomato;
}
</style>
