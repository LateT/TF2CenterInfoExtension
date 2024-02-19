const blueTeam = document.querySelectorAll('.blue-team div[id^=id] div.ym-gl.playerSlot.lobbySlot.filled');
const redTeam = document.querySelectorAll('.red-team div[id^=id] div.ym-gl.playerSlot.lobbySlot.filled');
// 125885
console.log(blueTeam);
console.log(redTeam);

const fetchRank = async (steamId) => {
    const b = JSON.stringify({
        steamid: steamId
    });
    console.log(b);
    try {
        const f = await fetch("http://localhost:3001/data", {
            method: "POST",
            body: b,
            headers: {
                "Content-Type": "application/json"
            }
        });
        const r = await f.json();
        console.log(r);
        return r;
    } catch (err) {
        console.log("Errori:: ", err);
    }
}

const displayRank = (team) => {
    [...team].map(o => {
        console.log(o);
        const d = o.querySelector("a").toString();
        const r = /profile\/(.*?)$/gm;
        const id = r.exec(d)[1];
        console.log(id);
        r.lastIndex = 0;
        fetchRank(id).then(result => {
            const statsContainer = o.querySelector(".details div.statsContainer");
            if (result != "404") {
                const divData = seasonInfo(result);
                let color;
                if (divData.sixesRank != null) {
                    const rank = divData.sixesRank.toLowerCase()
                    if (rank.includes("division 4") || rank.includes("low") || rank.includes("open") || rank.includes("fresh meat")) {
                        color = "red";
                    } else if (rank.includes("division 2") || rank.includes("division 1")) {
                        color = "green";
                    } else if (rank.includes("premiership")) {
                        color = "purple";
                    } else if (rank.includes("mid")) {
                        color = "yellow";
                    }
                    statsContainer.innerHTML += '<span style="color:' + color + '">6s:' + divData.sixesRank + '</span>';
                    console.log(statsContainer);
                } else {
                    
                    color = "red";
                    statsContainer.innerHTML += '<span style="color:' + color + '">6s:noob</span>';
                    console.log(statsContainer);
                }

            } else {
                    statsContainer.innerHTML += '<span style="color:red">6s:noob</span>';
                    console.log(statsContainer);
            }

        })


    })
}

const divRegex = (d) => {
    const r = /(open|low|mid|mid-low|division 4|division 3|division 2|division 1|premiership|fresh meat)/gmi;
    rtrn = r.exec(d)[1];
    r.lastIndex = 0;
    return rtrn;
}

const seasonInfo = (data) => {
    let finaldata = {
        sixesPlayed: null,
        noobModePlayed: null,
        sixesRank: null,
        noobModeRank: null,
    }
    data["data"].map(game => {
        if (game.competition.type == "6v6") {
            if (finaldata.sixesPlayed == null) {
                finaldata.sixesPlayed = 1;
            } else {
                finaldata.sixesPlayed++;
            }
            if (game.division.name != null) {
                if (finaldata.sixesRank == null) {
                    finaldata.sixesRank = game.division.name;
                }
            } else {
                const div = divRegex(game.competition.name);
                if (div != null) {
                    if (finaldata.sixesRank == null) {
                        finaldata.sixesRank = div;
                    }
                }
            }
        } else if (game.competition.type == "Highlander") {
            if (finaldata.noobModePlayed == null) {
                finaldata.noobModePlayed = 1;
            } else {
                finaldata.noobModePlayed++;
            }
            if (game.division.name != null) {
                if (finaldata.noobModeRank == null) {
                    finaldata.noobModeRank = game.division.name;
                }
            } else {
                const div = divRegex(game.competition.name);
                if (div != null) {
                    if (finaldata.sixesRank == null) {
                        finaldata.sixesRank = div;
                    }
                }
            }
        }

    })
    return finaldata;
}

displayRank(blueTeam);
displayRank(redTeam);
fetchRank(125885).then((d) => {
    console.log(seasonInfo(d));
})