# 1. Requirements

- ruby v3.3.0
- node v26.3.0
- watchman v2026.06.15.00
- cocoapods v1.15.2

# 2. Android app launch

1. npm i
2. npm run start
3. npm run android
4. JSON file is regenerated automatically on bundler launch.

# 3. iOS app launch

1. npm i
2. npm run pods
3. npm run start
4. npm run ios
5. JSON file is regenerated automatically on bundler launch.

# 4. Tests launch

1. npm i
2. npm run test
3. JSON file is regenerated automatically on tests luanch.

# 5. Approach explanation

1. On the home screen, I put the sorter and the 2 filters (type and performance) above the assets list. These are not scrollable together with the assets list, so that these are accessable anytime. The sorter and the 2 filters can be applied together, to have cummulative effect. Also all 3 list configurators (sorter and the 2 filters) have the "None" option to be able to discard the configurators. I made them in a form of dropdown to keep the screen height dedicated more to assets list and to not overwhelm the screen with to many elements like configurators' options. The dropdown position is adjusted to not go beyond the screen to keep it fully visible and to respect the horizontal margin.

2. The assets list loading is split into chunks of 50 element. Whenever the list scroll position reaches a specific threshold (1 screen till the list bottom margin), a new chunk is loaded and appended to the existent list. The new chunk has the configurations applied in such a manner that when it is appended to the existent list the final list maintains the same configurations. Fetching of a new chunk never returns an existent element from the existent list. Only new elements are fetched. Also the chunk always has 50 elements with the applied configurations if such a quantity still exists in the JSON file. If not, the remaining elements with the same configurations are fetched. If no more elements with such configurations remain, the new chunk has no elements as well.

3. The assets list gets reset whenever a configuration happens, meaning that the list will have again only one chunk of maximum 50 elements. When scroll happens again, new chunks fetches can happen, following the same logic with list bottom margin threshhold reach.

4. The list is permanently updated once in 5 seconds with the current prices.

5. By pressing on a list item from home screen, the navigation to the asset details screen happens. The header of the details screen contains the asset name and symbol, and on the left side there is a back button. The screen contains all the information about asset including the current price actualized once in 5 seconds.

6. Below the asset details are placed the similar assets. The similar assets also maintain the same configurations from the home screen, beside the fact that these are filtered to have the same name as the pressed asset.

# 6. Performance metrics

1. In the recordings folder are placed 2 recordings. One is made on Android Xiaomi Mi 8 Lite real device. Another one is made on iPhone 17 Pro Max real device.
2. I turned on the performance monitor during the recordings.

# 7. Tests mention

1. I wrote only unit tests for the most important function in this project, and namely for "retrieveAssetsChunk" function.
2. Not all cases where covered. Only the most important.

# 8. Final thoughts

It was an interesting task. It took me 21 hours to finish it, including the documentation writing.
Hopefully I described my approach well. Hopefully you won't encounter any issue with running the app locally. In case you have questions or problems running the app, feel free to contact me (mocansergiu93@gmail.com).
Thanks.
