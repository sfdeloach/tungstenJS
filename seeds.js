// TODO - this is a copy from YelpCamp, none of it has been refactored for Tungsten

var mongoose = require('mongoose'),
    Campground = require('./models/campground'),
    Comment = require('./models/comment');

campgroundData = [{
    name: "Midnight Wonder",
    image: "https://c1.staticflickr.com/7/6204/6047319257_b27c1be597_z.jpg",
    description: "-"
}, {
    name: "A Secluded Bearadise",
    image: "https://c1.staticflickr.com/5/4137/4825496283_7247cf6212_z.jpg",
    description: "Great for a fun family vacation or a romantic honeymoon, A Secluded Bearadise is a beautifully decorated, 2-story, secluded cabin in the Smokies which is centrally located half way between Gatlinburg and Pigeon Forge. The Cabin offers all the amenities you’d want in a vacation rental, the conveniences you enjoy from home, and a location just eight miles from Gatlinburg, Pigeon Forge, and the Great Smoky Arts and Crafts Community. This secluded two bedroom cabin is located on a beautiful, private hilltop where you can relax on the open porch or soak your troubles away in the outdoor, 6-person hot tub overlooking your scenic wooded views. The porch boasts authentic log furniture to carry the mountain feel throughout every inch of this cabin rental. A dining table for five offers a peaceful spot for outdoor meals on sunny days. With the lush woods of the Smoky Mountains surrounding your spacious deck, you’ll feel completely swept away from it all! One of your favorite spots in this gorgeous cabin will likely be the well-equipped game room! With fun décor and comfy seating, the game room is ideal for both children and adults of all ages. It features a pool table, popcorn maker, 60-game multicade, 50-inch plasma TV, and a window with a wooded view. The cabin is also well equipped with many movies, games, cards, puzzles and children’s toys. On cold nights and hot days you’ll spend many hours playing and hanging out with family and friends here. After game playing, settle down and watch a movie while snacking on “theater style” popcorn from the popcorn popper. For the technology lovers, there are also flat screen TVs in each of the bedrooms, and the family room is equipped with satellite TV. Wi-Fi/Internet access is also available for your convenience - you can keep up with the outside world or look up area attractions and upcoming events. This cabin is perfect for a family vacation or retreat with your friends. A Secluded Bearadise boasts two bedrooms, the master is furnished with a king size bed and the guest room with a queen size bed. Small children will love sleeping in Yogi and Boo Boo’s Dens which are built-in cubby holes complete with their very own twin mattress and alternative down comforters. For your little one’s convenience, this cabin is equipped with a Pack N Play and booster seat. For added peace of mind, this cabin is armed with a security system. Whether you are seeking serenity and relaxation in the hot tub or games and entertainment in the game room, this cabin is sure to make your vacation complete! With such a short drive to the Arts and Crafts Community, downtown Gatlinburg and Pigeon Forge, A Secluded Bearadise makes exploring these bustling mountain towns easy and convenient. You won’t waste time traveling to attractions and restaurants, so you’ll have more quality time actually enjoying them. An 8-mile loop of local artisans and craftsmen, the Great Smoky Arts and Crafts Community offers guests a huge variety of hand crafted goods – from pottery and paintings to jewelry and baskets. Along the drive you’ll find unique shops and classic Smoky Mountain scenery! A Secluded Bearadise is also convenient to popular area attractions, including Ripley’s Aquarium of the Smokies, Dollywood, and Fannie Farkle’s! You’ll find plenty of entertainment just minutes from your cozy cabin. A busy day in town will leave you ready to relax at your beautiful, cozy cabin. A Secluded Bearadise is truly the ideal mountain getaway and will leave you wanting to return again and again! Boasting lush wooded views, beautiful interiors, luxurious amenities, comfortable sleeping spaces, and plenty of outdoor room, A Secluded Bearadise may be your Smoky Mountain home away from home!"
}, {
    name: "ClearView",
    image: "https://c2.staticflickr.com/8/7215/7182369178_5572295ce0_z.jpg",
    description: "ClearView is a gorgeous, 2-story, cozy, yet airy log cabin located in the Eagle Crest Resort overlooking a spectacular mountain view. This cabin features a spacious interior with a glass and beam front wall, inviting the breathtaking view inside. The main level of this two story home features a full size, fully equipped kitchen with all modern amenities. The dining table provides seating for 5 and the living area features a sofa, love-seat, a double-sided gas log fireplace and large flat screen HDTV with cable and DVD. The enclosed bedroom features a queen sized bed, double sided gas log fireplace, adjoining full bathroom with shower and stacked washer/dryer. The deck on this level features a table with 4 chairs as well as a 4-person hot tub where guests can relax and enjoy the view. The spiral staircase in the dining area leads to an upper loft with the second bed and the game room. Here the open designed bedroom has a king sized bed, jetted tub and an adjoining full bathroom with shower tub. The Game Room features a pool table, fuzzball, Arcade Game, electronic dartboard and a variety of board games. Step out on the deck and relax in the rockers while enjoying the spectacular view. During the summer months, guests can enjoy a partial view of the Dollywood Fireworks display from the decks. You will also be able to hear the train whistle from here. ClearView has the most amazing sunsets and beautiful early morning skies! Guest staying at ClearView have access to Timber Tops seasonal outdoor pool and recreational area."
}, {
    name: "Knotty And Nice",
    image: "https://c2.staticflickr.com/6/5532/12009674985_4b0029f766_z.jpg",
    description: "Knotty and Nice is a lovely, three story, Appalachian style log cabin located on a paved road just half a mile off of Wears Valley road in Pigeon Forge. The cabin is secluded with a nice mountain view from the wrap around porch.The main level features rustic reclaimed yellow pine flooring, expansive cathedral ceilings, a stone gas fireplace, a 47 inch TV, DVD with HBO and Showtime.The charming, fully equipped kitchen offers upscale appliances and a convenient breakfast bar.Take in the mountain view from the dining table, or play a game of pool overlooking the small spring fed pond just outside the bay windows.The covered porch has a round six person hot tub, rocking chairs, a porch swing, and a rustic table for six. The loft bedroom has a cathedral ceiling, elegant king bed with a carved mountain scene headboard, and a TV with DVD player.The master bathroom has an over sized whirlpool tub for two and a separate shower."
}, {
    name: "An Elegant Escape",
    image: "https://img.bookonthebrightside.com/timbertops/large/44778.jpg",
    description: "An Elegant Escape is a beautiful secluded log cabin, nestled in the woods between Pigeon Forge & Gatlinburg. On entering the cabin, you are welcomed by the open floor plan with cathedral ceilings and large windows that will allow you to see the beauty of the forest from the comfort of the sofa or chair in the living room. The living room also features a 40 inch flat screen LCD TV and a gas fireplace for that extra comfort.  The kitchen comes fully equipped and the dining table has seating for four, so you can enjoy a meal together. Directly off the living room, the deck has a swing where you can enjoy the serenity of the mountains, a patio set to relax on and a table and chairs if you just want to enjoy an outdoors meal. The hot tub is located on the back deck where you can melt your cares away after spending the day exploring all that Pigeon Forge and Gatlinburg have to offer. The bedroom is on the main floor and offers a queen bed, 32 inch TV, DVD player, a corner jetted tub and a full bathroom. There is a door to the back deck from the bedroom. Upstairs in the open loft is where the game room is located with an electronic arcade, pool table and dart board. There is a comfortable sofa sleeper, a 47 inch flat screen HDTV to enjoy the game or a movie and a Play Station 2 with a large selection of games provided. Gather around the outdoor fire pit as evening falls and share some stories or just sit back and stare into the mesmerizing flames."
}, {
    name: "The Swimming Hole",
    image: "https://c1.staticflickr.com/5/4118/4927666269_87f6ca6a8d_z.jpg",
    description: "The Swimming Hole represents the ultimate in luxury; nothing compares to this Gatlinburg cabin rental! Conveniently located, offering spectacular views, this stunning, semi-secluded one bedroom log cabin is fast becoming one of the most sought after accommodations in the area. Located only minutes from downtown Gatlinburg, The Swimming Hole has been richly appointed and professionally decorated. The list of luxuries include a pool table, a heart shaped jetted tub, a rustic stone fireplace, a hot tub and an indoor swimming pool! Designed and built to the highest standards, the 7 ft 6 inches x 16 ft heated swimming pool has a large waterfall feature and a depth of 4 ft 6 inches. Rain or shine, sleet or snow, you can enjoy this feature any time of the year. Adjacent to the pool area is a full bathroom. This Gatlinburg cabin rental features a spacious, open living area, fully equipped kitchen and dining table with four chairs. Awaken to the mountain sunrise in your own private luxury lodge. Step outside onto the deck and enjoy all the features, including a table with chairs, swing, rockers and hot tub. There is also a grill and picnic table for days you want to spend enjoying the outdoors. This is the perfect Gatlinburg cabin for a couple or small party to enjoy all the amenities that The Swimming Hole has to offer. Get ready to make the most wonderful memories of your Gatlinburg cabin vacation!"
}];

function seedDb() {
    'use strict';
    // Wipeout the comments and campground collection
    Comment.remove({}, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('...comment collection dropped');
            Campground.remove({}, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('...campground collection dropped');
                    // Add campgrounds
                    campgroundData.forEach(function (seed) {
                        Campground.create(seed, function (err, campground) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log('...added a campground');
                                // Create and attach a comment
                                Comment.create({
                                    text: "Meatloaf pork belly boudin short ribs landjaeger burgdoggen.",
                                    author: "Homer Simpson"
                                }, function (err, comment) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        campground.comments.push(comment);
                                        campground.save();
                                        console.log('...created new comment');
                                    }
                                });
                            }
                        });
                    });
                }
            });
        }
    });
}

module.exports = seedDb;