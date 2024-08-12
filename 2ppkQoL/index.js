import {data} from "./data.js"
let pktime
let inpk = 0
let tempArray = [0,0,0]
let runpbdiff
let currentCp = 0
let cpTime
let cpTimeCounter
let cpDiff
let timeatcpT
let midrun = 1
let paceNeg
let pace
let cpspeed = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
let BestPossRun
let fullRunPbArray = [0,0,0]

ChatLib.chat("&1&l[2p] &aRun /2p-help for a list of commands !")

register('packetReceived', () => {
  if(inpk==1){
    pktime += 50
    cpTimeCounter +=50
  }
}).setFilteredClass(Java.type("net.minecraft.network.play.server.S32PacketConfirmTransaction"))

register("chat", (player, time, event) => {
  if(player == data.playerIgn) {
    inpk = 0 
    cancel(event)
    pkEnd()
  }
}).setCriteria("${player} completed the parkour in ${time}!")

function pkEnd() {
  if(midrun!=1) {
  cpReached()
  PaceHelper()
  if (data.runpb[data.slot] > pktime || data.runpb[data.slot] == null){
    data.pbRunCp[data.slot] = cpspeed
    runpbdiff = timeFormat(Math.abs(pktime - data.runpb[data.slot]))
    data.runpb[data.slot] = pktime
    pktime = timeFormat(pktime)
    if(pktime[0]==0) {
      if(runpbdiff[0]==0) {
        ChatLib.chat("&1&l[2p] &bYou completed the parkour in &b&l" +pktime[1]+"."+pktime[2]+"! &9&l(-"+runpbdiff[1]+"."+runpbdiff[2]+")")
      } else if(runpbdiff[0]>=1) {
        ChatLib.chat("&1&l[2p] &bYou completed the parkour in &b&l" +pktime[1]+"."+pktime[2]+"! &9&l(-"+runpbdiff[0]+":"+runpbdiff[1]+"."+runpbdiff[2]+")")
      }
    } else if (pktime[0]>=1) {
      if(runpbdiff[0]==0) {
        ChatLib.chat("&1&l[2p] &bYou completed the parkour in &b&l" +pktime[0]+":"+pktime[1]+"."+pktime[2]+"! &9&l(-"+runpbdiff[1]+"."+runpbdiff[2]+")")
      } else if(runpbdiff[0]>=1) {
        ChatLib.chat("&1&l[2p] &bYou completed the parkour in &b&l" +pktime[0]+":"+pktime[1]+"."+pktime[2]+"! &9&l(-"+runpbdiff[0]+":"+runpbdiff[1]+"."+runpbdiff[2]+")")
      }
    }
  } else {
    runpbdiff = timeFormat(Math.abs(pktime - data.runpb[data.slot]))
    pktime = timeFormat(pktime)
    if(pktime[0]==0) {
      if(runpbdiff[0]==0) {
        ChatLib.chat("&1&l[2p] &aYou completed the parkour in &a&l" +pktime[1]+"."+pktime[2]+"! &c&l(+"+runpbdiff[1]+"."+runpbdiff[2]+")")
      } else if(runpbdiff[0]>=1) {
        ChatLib.chat("&1&l[2p] &aYou completed the parkour in &a&l" +pktime[1]+"."+pktime[2]+"! &c&l(+"+runpbdiff[0]+":"+runpbdiff[1]+"."+runpbdiff[2]+")")
      }
    } else if (pktime[0]>=1) {
      if(runpbdiff[0]==0) {
        ChatLib.chat("&1&l[2p] &aYou completed the parkour in &a&l" +pktime[0]+":"+pktime[1]+"."+pktime[2]+"! &c&l(+"+runpbdiff[1]+"."+runpbdiff[2]+")")
      } else if(runpbdiff[0]>=1) {
        ChatLib.chat("&1&l[2p] &aYou completed the parkour in &a&l" +pktime[0]+":"+pktime[1]+"."+pktime[2]+"! &c&l(+"+runpbdiff[0]+":"+runpbdiff[1]+"."+runpbdiff[2]+")")
      }
    }
  }
}}

register("chat", (event) => {
  cancel(event)
  inpk = 1
  midrun = 0
  cpTimeCounter = 0
  currentCp = 0
  pktime = 0
  cpspeed = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
  display.setLine(1,"&7&lPace = 0.0")
  ChatLib.chat("&r&aParkour challenge started!&r");
}).setCriteria("Reset your timer to 00:00! Get to the finish line!");

register("chat", (event) => {
  cancel(event);
  inpk = 1
  midrun = 0
  cpTimeCounter = 0
  currentCp = 0
  pktime = 0
  cpspeed = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
  display.setLine(1,"&7&lPace = 0.0")
  ChatLib.chat("&r&aParkour challenge started!&r");
}).setCriteria("Parkour challenge started!");

register("chat", (event) => {
  cancel(event);
}).setCriteria("Unfortunately you did not break any of the records for this parkour!");

function timeFormat(ms) {
  let tempsec = 0
  let tempmin = 0 
  while (ms >= 1000 || tempsec >= 60) {
    if(ms >= 1000) {
      ms -= 1000
      tempsec += 1
    } else if (tempsec>=60){
      tempsec -= 60
      tempmin += 1
    }}
    tempsec = String(tempsec).padStart(2, '0');
    ms = String(ms).padStart(3, '0');
    tempArray = [tempmin, tempsec, ms]
    return tempArray
  }

  register("chat", (Num, event) => {
    if(Num == (currentCp+1)) {
      cancel(event)
      cpReached()
      PaceHelper()
    }
  }).setCriteria("You reached Checkpoint #${Num}")

function cpReached() {
  if(midrun != 1) {
  cpTime = cpTimeCounter
  cpspeed[currentCp] = pktime
  cpTimeCounter = 0
  if(data.pbCheckpoints[data.slot][currentCp] > cpTime || data.pbCheckpoints[data.slot][currentCp]==0 || data.pbCheckpoints[data.slot][currentCp]==null) {
    cpDiff = timeFormat(Math.abs(cpTime - data.pbCheckpoints[data.slot][currentCp]))
    data.pbCheckpoints[data.slot][currentCp] = cpTime
    cpTime = timeFormat(cpTime)
    if(cpTime[0]==0) {
      if(cpDiff[0]==0) {
        ChatLib.chat("&1&l[2p] &bCheckpoint &b&l" + (currentCp) + " &btook &l" +cpTime[1]+"."+cpTime[2]+"! &9&l(-"+cpDiff[1]+"."+cpDiff[2]+")")
      } else if(cpDiff[0]>=1) {
        ChatLib.chat("&1&l[2p] &bCheckpoint &b&l" + (currentCp) + " &btook &l" +cpTime[1]+"."+cpTime[2]+"! &9&l(-"+cpDiff[0]+":"+cpDiff[1]+"."+cpDiff[2]+")")
      }
    } else if (cpTime[0]>=1) {
      if(cpDiff[0]==0) {
        ChatLib.chat("&1&l[2p] &bCheckpoint &b&l" + (currentCp) + " &btook &l" +cpTime[0]+":"+cpTime[1]+"."+cpTime[2]+"! &9&l(-"+cpDiff[1]+"."+cpDiff[2]+")")
      } else if(cpDiff[0]>=1) {
        ChatLib.chat("&1&l[2p] &bCheckpoint &b&l" + (currentCp) + " &btook &l" +cpTime[0]+":"+cpTime[1]+"."+cpTime[2]+"! &9&l(-"+cpDiff[0]+":"+cpDiff[1]+"."+cpDiff[2]+")")
      }
    }
  } else {
      cpDiff = timeFormat(Math.abs(cpTime - data.pbCheckpoints[data.slot][currentCp]))
    cpTime = timeFormat(cpTime)
    if(cpTime[0]==0) {
      if(cpDiff[0]==0) {
        ChatLib.chat("&1&l[2p] &aCheckpoint &d&l" + (currentCp) + " &atook &l" +cpTime[1]+"."+cpTime[2]+"! &c&l(+"+cpDiff[1]+"."+cpDiff[2]+")")
      } else if(cpDiff[0]>=1) {
        ChatLib.chat("&1&l[2p] &aCheckpoint &d&l" + (currentCp) + " &atook &l" +cpTime[1]+"."+cpTime[2]+"! &c&m(+"+cpDiff[0]+":"+cpDiff[1]+"."+cpDiff[2]+")")
      }
    } else if (cpTime[0]>=1) {
      if(cpDiff[0]==0) {
        ChatLib.chat("&1&l[2p] &aCheckpoint &d&l" + (currentCp) + " &atook &l" +cpTime[0]+":"+cpTime[1]+"."+cpTime[2]+"! &c&l(+"+cpDiff[1]+"."+cpDiff[2]+")")
      } else if(cpDiff[0]>=1) {
        ChatLib.chat("&1&l[2p] &aCheckpoint &d&l" + (currentCp) + " &atook &l" +cpTime[0]+":"+cpTime[1]+"."+cpTime[2]+"! &c&l(+"+cpDiff[0]+":"+cpDiff[1]+"."+cpDiff[2]+")")
      }
    }
}}
currentCp += 1
}

function PaceHelper () {
    if (data.pbRunCp[data.slot][0] != 0){
  timeatcpT = pktime
  if((timeatcpT - data.pbRunCp[data.slot][currentCp-1]) < 0) {
    pace = Math.abs(timeatcpT - data.pbRunCp[data.slot][currentCp-1])
    pace = timeFormat(pace)
    paceNeg = 1
  } else {
  pace = (timeatcpT - data.pbRunCp[data.slot][currentCp-1])
  pace = timeFormat(pace)
  paceNeg = 0}
  paceDisplayHelper()
  }
}

function paceDisplayHelper(){
   if(paceNeg == 0) {
    if(pace[0] > 0) {
      display.setLine(1,"&c&lPace = +"+pace[0]+":"+pace[1]+"."+pace[2])
    } else {
      display.setLine(1,"&c&lPace = +"+pace[1]+"."+pace[2])
    }
   }
   if(pace[0] == 0 && pace[1] == 0 && pace[2] == 0) {
     display.setLine(1,"&7&lPace = 0.0")
  }
   if(paceNeg == 1) {
     if(pace[0] > 0) {
       display.setLine(1,"&9&lPace = -"+pace[0]+":"+pace[1]+"."+pace[2])
     } else {
       display.setLine(1,"&9&lPace = -"+pace[1]+"."+pace[2])
     }
  }
 }

  const display = new Display();
  display.setRenderLoc(data.paceLoc[0], data.paceLoc[1])

register("chat", () => {
  currentCp = 0
  midrun = 1
  ChatLib.chat("&1&l[2p] &aYou are on slot "+data.slot+". Owner : "+data.slotIgn[data.slot]+".")
}).setCriteria("Sending you to ${idk}")

register("chat", () => {
  currentCp = 0
  midrun = 1
  ChatLib.chat("&1&l[2p] &aYou are on slot "+data.slot+". Owner : "+data.slotIgn[data.slot]+".")
}).setCriteria("Attempting to teleport you to ${idk}")


let i = 0
let amountofcp
function pbdisplay() {
  amountofcp=data.slotCp[data.slot]
  BestPossRun = 0
    const clickableCp = new Message([new TextComponent("&b&l(Cp PBs times) ").setClick("run_command", "/Checkpointpb"),new TextComponent("&b&l(Cps Of PB Run)").setClick("run_command", "/Checkpointonpb")])
  ChatLib.chat("&1&l[2p] &bSome PBs stats for slot "+(data.slot+1)+" :")
  ChatLib.chat("&1")
  if (data.runpb[data.slot] != 0 && data.runpb[data.slot] != null) {
  fullRunPbArray = timeFormat(data.runpb[data.slot])
  ChatLib.chat("&b&lFull Run Pb = "+fullRunPbArray[0]+":"+fullRunPbArray[1]+"."+fullRunPbArray[2]+" !")} else {ChatLib.chat("&b&lFull Run Pb is not set !")}
  if (data.pbCheckpoints[data.slot][0] != 0) {
  while (i <= amountofcp) {
    if (amountofcp >= 1) {
    BestPossRun += data.pbCheckpoints[data.slot][i]
    i++}} i = 0
    BestPossRun = timeFormat(BestPossRun)
  ChatLib.chat("&b&lBest Possible Time = "+BestPossRun[0]+":"+BestPossRun[1]+"."+BestPossRun[2]+" !")} else {ChatLib.chat("&b&lBest Possible Time is not set !")}
  ChatLib.chat("&1")
  ChatLib.chat(clickableCp)
}

register("command", () => {
  if (data.pbCheckpoints[data.slot][0] != 0) {
    ChatLib.chat("&1");
    for (let i = 1; i <= amountofcp; i++) {
      if (amountofcp >= 1) {
        tempArray = timeFormat(data.pbCheckpoints[data.slot][i]);
        ChatLib.chat("&aCheckpoint " + i + " Pb is &b" + tempArray[0] + ":" + tempArray[1] + "." + tempArray[2]);
      }
    }
  } else {
    ChatLib.chat("&b&lCheckpoints PB are not set !");
  }
  i = 0;
}).setName("Checkpointpb");

register("command", () => {
  if (data.pbRunCp[data.slot][0] != 0) {
    ChatLib.chat("&1");
    for (let i = 1; i <= amountofcp; i++) {
      if (amountofcp >= 1) {
        tempArray = timeFormat(data.pbRunCp[data.slot][i]);
        ChatLib.chat("&aOn your pb run you reached cp " + i + " in &b" + tempArray[0] + ":" + tempArray[1] + "." + tempArray[2]);
      }
    }
  } else {
    ChatLib.chat("&b&lCheckpoints time on PB run are not set !");
  }
}).setName("Checkpointonpb");

  register("command", (ign) => {
    data.playerIgn = ign
    ChatLib.chat("&1&l[2p] &bIGN set to "+data.playerIgn+".")
  }).setName("2p-ign")

  register("command", (a,b) => {
    data.paceLoc[0] = a
    data.paceLoc[1] = b
    display.setRenderLoc(data.paceLoc[0], data.paceLoc[1])
    ChatLib.chat("&1&l[2p] &bRefreshed pace HUD location.")
  }).setName("2p-paceloc")

  register("command", () => {
    ChatLib.chat("&1&l[2p] &bReset all data !")
    data.playerIgn = null
    data.slot =  0
    data.slotIgn = [null,null,null,null,null]
    data.slotCp[null,null,null,null,null]
    data.paceLoc = [0,0]
    data.runpb = [null,null,null,null,null]
    data.pbCheckpoints = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]
    data.pbRunCp = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]
  }).setName("2p-resetall")

  register("command", (num) => {
    if(num >= 1 && num <= 5) {
      data.slot = (num-1)
      ChatLib.chat("&1&l[2p] &bSwapped to slot "+num+".")
    }
  }).setName("2p-slot")

  register("command", (slot, name) => {
    if(slot >= 1 && slot <= 5) {
      data.slotIgn[(slot-1)] = name
      ChatLib.chat("&1&l[2p] &bSet slot "+slot+"'s owner ign to "+name+".")
    }
  }).setName("2p-slotrename")

  register("command", (slot, amount) => {
    if(slot >= 1 && slot <= 5) {
      data.slotCp[(slot-1)] = amount
      ChatLib.chat("&1&l[2p] &bSet slot "+slot+" number of cp to "+amount+".")
    }
  }).setName("2p-slotcp")

  register("command", (slot) => {
    if(slot >= 1 && slot <= 5) {
    ChatLib.chat("&1&l[2p] &bReset data for the selected slot !")
    data.slotIgn[data.slot] = null
    data.slotCp[data.slot] = null
    data.runpb[data.slot] = null
    data.pbCheckpoints[data.slot] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    data.pbRunCp[data.slot] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    }
  }).setName("2p-reset")

  register("command", () => {
    ChatLib.chat("&bHere are some info about your slots :")
    ChatLib.chat("&a1. Owner : "+data.slotIgn[0]+", Cp : "+data.slotCp[0]+".")
    ChatLib.chat("&a2. Owner : "+data.slotIgn[1]+", Cp : "+data.slotCp[1]+".")
    ChatLib.chat("&a3. Owner : "+data.slotIgn[2]+", Cp : "+data.slotCp[2]+".")
    ChatLib.chat("&a4. Owner : "+data.slotIgn[3]+", Cp : "+data.slotCp[3]+".")
    ChatLib.chat("&a5. Owner : "+data.slotIgn[4]+", Cp : "+data.slotCp[4]+".")
  }).setName("2p-slotinfo")

  register("command", () => {
    pbdisplay()
  }).setName("2p-pb")

  register("command", () => {
    ChatLib.chat("&1Here is a list of commands :")
    ChatLib.chat("&b/2p-ign [Your IGN], required for the module to function")
    ChatLib.chat("&b/2p-paceloc [X coord] [Y coord], changes the location of the pace HUD")
    ChatLib.chat("&b/2p-resetall, resets all data")
    ChatLib.chat("&b/2p-slot [1-5], 1 slot = 1 housing")
    ChatLib.chat("&b/2p-slotrename [slot] [ign of the owner], sets the name of the owner of the house of slot")
    ChatLib.chat("&b/2p-slotcp [slot] [amount of checkpoints], for maths (dont include end plate)")
    ChatLib.chat("&b/2p-reset [slott], resets all the PBs and information for the selected slot")
    ChatLib.chat("&b/2p-slotinfo, here to try and make all of this understandable")
    ChatLib.chat("&b")
    ChatLib.chat("&b/2p-pb, only usefull command in the gameplay.")
  }).setName("2p-help")