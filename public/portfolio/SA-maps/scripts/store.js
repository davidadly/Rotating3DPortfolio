export default {
  nxtA: 3,
  prevA: 0,
  orientation: "horizontal",
  toggleOrientation() {
    this.orientation =
      this.orientation === "horizontal" ? "vertical" : "horizontal";
  },
  currentObjs: [0, 1, 2, 3],
  removeOne(index) {
    this.currentObjs.splice(index, 1);
  },
  cNext() {
    this.nxtA++;
    if (this.nxtA >= this.models.length) this.nxtA = 0;

    while (this.currentObjs.includes(this.nxtA)) {
      let nNum = Math.max(...this.currentObjs) + 1;
      if (nNum >= this.models.length) nNum = 0;
      this.nxtA = nNum;
    }
    this.currentObjs.push(this.nxtA);
  },

  cPrev() {
    this.prevA--;
    if (this.prevA < 0) this.prevA = this.models.length - 1;

    while (this.currentObjs.includes(this.prevA)) {
      let nNum = Math.min(...this.currentObjs) - 1;
      if (nNum < 0) nNum = this.models.length - 1;
      this.prevA = nNum;
    }
    this.currentObjs.push(this.prevA);
  },

  models: [
    {
      file: "/portfolio/SA-maps/assets/models/pastvillage/pastvillage.glb",
      oR: { x: 1.8, y: Math.PI, z: 0 },
    },
    {
      file: "/portfolio/SA-maps/assets/models/egg_carrier/egg_carrier.glb",
      oR: { x: Math.PI / 2, y: 0, z: 0 }
    },
    {
      file: "/portfolio/SA-maps/assets/models/emerald_coast/emerald_coast.glb",
      oR: { x: Math.PI / 2, y: 0, z: 0 },
    },
    {
    file: "/portfolio/SA-maps/assets/models/mystic_ruins/mystic_ruins.glb",
      oR: { x: 0.6, y: 0, z: 0 },
      oS: { x: .5, y: .5, z: .5 },
    },
    {
      file: "/portfolio/SA-maps/assets/models/past_shrine/past_shrine.glb",
      oR: { x: 1.2, y: 0, z: 0 },
            oS: { x: .5, y: .5, z: .5 },
    },
    {
      file: "/portfolio/SA-maps/assets/models/red_mountain/red_mountain.glb",
      oR: { x: Math.PI / 2, y: 0, z: 0 },
      oS: { x: .5, y: .5, z: .5 },
    },
    {
      file: "/portfolio/SA-maps/assets/models/pastvillage/pastvillage.glb",
      oR: { x: 1.8, y: Math.PI, z: 0 },
      oS: { x: .5, y: .5, z: .5 },
    },
  ],
};
