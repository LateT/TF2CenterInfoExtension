
// 125885

const fetchRank = async (steamId) => {
    const b = JSON.stringify({
        steamid: steamId
    });
    try {
        const f = await fetch("http://localhost:3001/data", {
            method: "POST",
            body: b,
            headers: {
                "Content-Type": "application/json"
            }
        });
        const r = await f.json();
        return r;
    } catch (err) {
        console.log("Errori:: ", err);
    }
}

const displayRank = (team) => {
    [...team].map(o => {
        const selectRankIfExists = o.querySelector(" .details .statsContainer .rank");
        if (selectRankIfExists == null) {
            const tf2cProfileUrl = o.querySelector("a").href;
            const regex = /profile\/(.*?)$/gm;
            const steamId = regex.exec(tf2cProfileUrl)[1];
            regex.lastIndex = 0;
            const rankInfo = fetchRank(steamId);
            rankInfo.then(r => {
                const infoObject = seasonInfo(r);
                if (infoObject != "404") {
                    if (infoObject.sixesRank != null) {
                        const rankSpan = "<span style='color: " + rankColor(infoObject.sixesRank) + "' class='rank'>" + infoObject.sixesRank + "</span>";
                        o.querySelector(" .details .statsContainer").innerHTML += rankSpan;
                    } else {
                        // no etf2l
                    }
                } else {
                    //  no etf2l
                }
            })
        }
    });
}

const rankColor = (rank) => {
    let rtrnColor = "red";
    switch (rank.toLowerCase()) {
        case "mid":
            rtrnColor = "yellow";
            break;
        case "division 3":
            rtrnColor = "yellow";
            break;
        case "division 2":
            rtrnColor = "green";
            break;
        case "division 1":
            rtrnColor = "green";
            break;
        case "premiership":
            rtrnColor = "blue";
            break;
    }
    return rtrnColor;
}

const divRegex = (d) => {
    const r = /(open|low|mid|mid-low|division 5|division 4|division 3|division 2|division 1|premiership|fresh meat)/gmi;
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
const displayTeamRanks = () => {
    const blueTeam = document.querySelectorAll('.blue-team div[id^=id] div.ym-gl.playerSlot.lobbySlot.filled');
    const redTeam = document.querySelectorAll('.red-team div[id^=id] div.ym-gl.playerSlot.lobbySlot.filled');
    displayRank(blueTeam);
    displayRank(redTeam);
}
displayTeamRanks();



