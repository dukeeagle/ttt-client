<ion-view ng-controller="LoginController as logcntrl" class="light">
      <ion-content>
          <div class="list list-inset light top180">
              <label class="item item-input linegrey" >
                <input type="text" class="linegrey white" placeholder="What is your nickname?" ng-model="logcntrl.nickname">
              </label>
              <button class="button button-block button-grey" ng-click="logcntrl.join()">Join</button>
          </div>
      </ion-content>
    </ion-view>
    