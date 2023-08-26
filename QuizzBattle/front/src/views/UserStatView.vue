<template>
    <Navigation>
        <div class="stats">
            <div class="column">
                <div class="entity-title">
                    <img src="\src\assets\images\default-profile-picture.jpg" alt="stats" class="stats-img">
                </div>
                <div class="entity">
                    <h4>Player Name</h4>
                    <p>{{ player.playername }}</p>
                </div>
                <div class="entity">
                    <h4>Nickname</h4>
                    <p>{{ player.nickname }}</p>
                </div>
                <div class="entity">
                    <h4>Top category</h4>
                    <p>{{ player.topgame }}</p>
                </div>
                <div class="entity">
                    <h4>Categories Play</h4>
                    <p>{{ player.gameplay }}</p>
                </div>
            </div>
            <div class="column">
                <div class="entity-title">
                    <h4>Total Score</h4>
                    <p>{{ player.score }}</p>
                </div>
                <div class="entity">
                    <h4>Score Music</h4>
                    <div class="row">
                        <div class="scorebar">
                            <div class="scorerate" :style="getScore(player.musicscrore)"></div>
                        </div>
                        <p>{{ player.musicscrore }}/100</p>
                    </div>
                </div>
                <div class="entity">
                    <h4>Score Sport&Leisure</h4>
                    <div class="row">
                        <div class="scorebar">
                            <div class="scorerate" :style="getScore(player.sportscore)"></div>
                        </div>
                        <p>{{ player.sportscore }}/100</p>
                    </div>
                    
                </div>
                <div class="entity">
                    <h4>Score Film&TV</h4>
                    <div class="row">
                        <div class="scorebar">
                            <div class="scorerate" :style="getScore(player.filmscore)"></div>
                        </div>
                        <p>{{ player.filmscore }}/100</p>
                    </div>
                </div>
                <div class="entity">
                    <h4>Score Arts&Literature</h4>
                    <div class="row">
                        <div class="scorebar">
                            <div class="scorerate" :style="getScore(player.artscore)"></div>
                        </div>
                        <p>{{ player.artscore }}/100</p>
                    </div>
                </div>
            </div>
            <div class="column">
                <div class="entity-title">
                    <h4>Games Played</h4>
                    <p>{{ player.gamesPlayed }}</p>
                </div>
                <div class="entity">
                    <h4>Score History</h4>
                    <div class="row">
                        <div class="scorebar">
                            <div class="scorerate" :style="getScore(player.historyscrore)"></div>
                        </div>
                        <p>{{ player.historyscrore }}/100</p>
                    </div>
                </div>
                <div class="entity">
                    <h4>Score Scociety&Culture</h4>
                    <div class="row">
                        <div class="scorebar">
                            <div class="scorerate" :style="getScore(player.culturescore)"></div>
                        </div>
                        <p>{{ player.culturescore }}/100</p>
                    </div>
                </div>
                <div class="entity">
                    <h4>Score Science</h4>
                    <div class="row">
                        <div class="scorebar">
                            <div class="scorerate" :style="getScore(player.sciencescore)"></div>
                        </div>
                        <p>{{ player.sciencescore }}/100</p>
                    </div>
                </div>
                <div class="entity">   
                    <h4>Score Geography</h4>
                    <div class="row">
                        <div class="scorebar">
                            <div class="scorerate" :style="getScore(player.geographyscore)"></div>
                        </div>
                        <p>{{ player.geographyscore }}/100</p>
                    </div>
                </div>
            </div>
            <div class="column">
                <div class="entity-title">
                    <h4>Average Score</h4>
                    <p>{{ player.averageScore }}</p>
                </div>
                <div class="entity">
                    <h4>Score General Knowledge</h4>
                    <div class="row">
                        <div class="scorebar">
                            <div class="scorerate" :style="getScore(player.generalscore)"></div>
                        </div>
                        <p>{{ player.generalscore }}/100</p>
                    </div>
                </div>
                <div class="entity">
                    <h4>Score Food&Drink</h4>
                    <div class="row">
                        <div class="scorebar">
                            <div class="scorerate" :style="getScore(player.foodscore)"></div>
                        </div>
                        <p>{{ player.foodscore }}/100</p>
                    </div>
                </div>
                <div class="entity">
                    <h4>Score Politics</h4>
                    <div class="row">
                        <div class="scorebar">
                            <div class="scorerate" :style="getScore(player.politicscore)"></div>
                        </div>
                        <p>{{ player.politicscore }}/100</p>
                    </div>
                </div>
                <div class="entity">
                    <h4>Score Nature</h4>
                    <div class="row">
                        <div class="scorebar">
                            <div class="scorerate" :style="getScore(player.naturescore)"></div>
                        </div>
                        <p>{{ player.naturescore }}/100</p>
                    </div>
                </div>
            </div>
        </div>
    </Navigation>
</template>


<style>


.stats {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-top: 5%;
    margin-bottom: 5%;
    border: 1px solid rgb(226 232 240);
    border-radius: 10px;
    padding: 2rem;
    background-color: rgb(248 250 252);
}

.column {
    width: 100%;
    height: 100%;
    padding: 0 2rem;
    border-right: .5px solid rgb(226 232 240);

}

.column:last-child {
    border-right: none;
}

.entity {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    margin-bottom: 2rem;
}

.entity-title {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    margin-bottom: 2rem;
    height: 120px;
}

.entity-title h4 {
    font-size: 15px;
    font-weight: 600;
    margin-bottom: 1rem;
    color: rgb(107 114 128);
}

.entity-title p {
    font-size: 20px;
    font-weight: 600;
    color: rgb(55 65 81);
    margin-bottom: 1rem;
}

h4{
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 1rem;
    color: rgb(107 114 128);
}

p {
    font-size: 16px;
    font-weight: 600;
    color: rgb(55 65 81);
}

.stats .entity-title img{
    width: 100px;
    height: 100px;
    border-radius: 15%;
    margin-bottom: 1rem;
}


.row {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
}

.scorebar {
    width: 100px;
    height: 20px;
    background-color: rgb(107 114 128);
    border-radius: 10px;
    margin-right: 1rem;
}

.scorerate {
    height: 100%;
    background-color: rgb(52 211 153);
    border-radius: 10px;
}

@media (max-width: 1080px) {
    .stats {
        flex-direction: column;
    }

    .column{
        border-right: none;
         padding: .5rem 1rem;
        border-bottom: .5px solid rgb(226 232 240);
    }
    .column:last-child {
        border-bottom: none;
    }
    
}

@media (max-width: 768px) {

    .stats{
        overflow: scroll;
    }
    
}

</style>


<script setup lang="ts">

import {  Component, Vue } from 'vue';
import {API_URL} from '../constants';
import Navigation from "@/components/Navigation.vue";

const player = 
    {
        playername: "Laila Charaoui",
        nickname: "Laila",
        topgame: "Afida Turner",
        gameplay: "Afida Turner",
        score: 100,
        gamesPlayed: 10,
        averageScore: 10,
        musicscrore: 80,
        sportscore: 45,
        filmscore: 68,
        artscore: 34,
        historyscrore: 89,
        culturescore: 69,
        sciencescore: 42,
        geographyscore: 92,
        generalscore: 14,
        foodscore: 100,
        politicscore: 26,
        naturescore: 48,
    
    }

    // get player stats for witdh of scorebar for each category



function getScore($data): Record<string, string> {
  const percentage = $data; // Assuming score is out of 100
  if (percentage < 20) {
    return {
      width: `${percentage}%`,
      background: ` rgb(255 107 107) `,
    };
  }
  if (percentage < 50) {
    return {
      width: `${percentage}%`,
      background: ` rgb(252 211 77) `,
    };
  }
if (percentage < 100) {
    return {
    width: `${percentage}%`,
    background: ` rgb(52 211 153) `,
    };
}
}



</script>