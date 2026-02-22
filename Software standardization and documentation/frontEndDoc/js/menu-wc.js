'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">maze-runner-game documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                                <li class="link">
                                    <a href="overview.html" data-type="chapter-link">
                                        <span class="icon ion-ios-keypad"></span>Overview
                                    </a>
                                </li>

                            <li class="link">
                                <a href="index.html" data-type="chapter-link">
                                    <span class="icon ion-ios-paper"></span>
                                        README
                                </a>
                            </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>

                    </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#components-links"' :
                            'data-bs-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/App.html" data-type="entity-link" >App</a>
                            </li>
                            <li class="link">
                                <a href="components/BattleLevel.html" data-type="entity-link" >BattleLevel</a>
                            </li>
                            <li class="link">
                                <a href="components/ChestDialog.html" data-type="entity-link" >ChestDialog</a>
                            </li>
                            <li class="link">
                                <a href="components/Credits.html" data-type="entity-link" >Credits</a>
                            </li>
                            <li class="link">
                                <a href="components/InventoryDialog.html" data-type="entity-link" >InventoryDialog</a>
                            </li>
                            <li class="link">
                                <a href="components/MainMenu.html" data-type="entity-link" >MainMenu</a>
                            </li>
                            <li class="link">
                                <a href="components/MazeLevel.html" data-type="entity-link" >MazeLevel</a>
                            </li>
                            <li class="link">
                                <a href="components/SaveSlots.html" data-type="entity-link" >SaveSlots</a>
                            </li>
                            <li class="link">
                                <a href="components/Settings.html" data-type="entity-link" >Settings</a>
                            </li>
                            <li class="link">
                                <a href="components/Start.html" data-type="entity-link" >Start</a>
                            </li>
                            <li class="link">
                                <a href="components/StartMenu.html" data-type="entity-link" >StartMenu</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/Cell.html" data-type="entity-link" >Cell</a>
                            </li>
                            <li class="link">
                                <a href="classes/Maze.html" data-type="entity-link" >Maze</a>
                            </li>
                            <li class="link">
                                <a href="classes/RandomNumber.html" data-type="entity-link" >RandomNumber</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/MusicService.html" data-type="entity-link" >MusicService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PublicFunctions.html" data-type="entity-link" >PublicFunctions</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SavesService.html" data-type="entity-link" >SavesService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/IAnimationFrames.html" data-type="entity-link" >IAnimationFrames</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IBiome.html" data-type="entity-link" >IBiome</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ICharacterAnimations.html" data-type="entity-link" >ICharacterAnimations</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IChest.html" data-type="entity-link" >IChest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IChestAnimationFrames.html" data-type="entity-link" >IChestAnimationFrames</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IChestAnimations.html" data-type="entity-link" >IChestAnimations</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IControls.html" data-type="entity-link" >IControls</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IEnemy.html" data-type="entity-link" >IEnemy</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IEnemyAnimation.html" data-type="entity-link" >IEnemyAnimation</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IEnemyAnimations.html" data-type="entity-link" >IEnemyAnimations</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IFrame.html" data-type="entity-link" >IFrame</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IInventory.html" data-type="entity-link" >IInventory</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IInventorySlot.html" data-type="entity-link" >IInventorySlot</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IItem.html" data-type="entity-link" >IItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IMainChar.html" data-type="entity-link" >IMainChar</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ISave.html" data-type="entity-link" >ISave</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ISettings.html" data-type="entity-link" >ISettings</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WallDecor.html" data-type="entity-link" >WallDecor</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#pipes-links"' :
                                'data-bs-target="#xs-pipes-links"' }>
                                <span class="icon ion-md-add"></span>
                                <span>Pipes</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="pipes-links"' : 'id="xs-pipes-links"' }>
                                <li class="link">
                                    <a href="pipes/TimestampPipePipe.html" data-type="entity-link" >TimestampPipePipe</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});