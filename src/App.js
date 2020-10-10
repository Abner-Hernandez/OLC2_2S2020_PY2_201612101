import React, { Component } from 'react'; 
import TextArea from './Components/TextArea';
import Table from './Components/Table';
import { Graphviz } from 'graphviz-react';
import { interprete } from './docs/interprete';
import { grammar } from './docs/grammar';
import { ast } from './docs/ast';

class App extends Component {

  constructor(props) {
    super(props);
    this.child1 = React.createRef();
    this.child2 = React.createRef();
    this.child3 = React.createRef();
    this.child4 = React.createRef();
    this.text1 = "";
    this.text2 = "";
    this.ast_translate = "";
    this.ast_interprete = "";
    this.ast = `digraph G {start -> a0;start -> b0;}`;
    this.table_simbol = ["Nombre", "Tipo", "Ambito", "Fila", "Columna"]
    this.errors = ["Tipo", "Descripción", "Línea", "Columna"]
    this.state = {
      value: ''
    }
  }

  translate_input = (e) => {
    var arr = [];
    localStorage.setItem('errores_T', JSON.stringify(arr));
    localStorage.setItem('simbtable_T', JSON.stringify(arr));

    try{
      var ast_trans = ast.parse(this.text1);
      this.ast = ast_trans;
    }catch(e){ console.log(e); console.log("error ast traduccion")}
    
    try{
      var data = grammar.parse(this.text1);
      this.text2 = data;
      this.child2.current.modify_text(data);
      this.child3.current.removeRow();
      this.child4.current.removeRow();
      this.child3.current.agregar_datos(JSON.parse(localStorage.getItem('errores_T')));
      this.child4.current.agregar_datos(JSON.parse(localStorage.getItem('simbtable_T')));
    }catch(e){ console.log(e); }

  }

  ejecutar_input = (e) => {
    var arr = [];
    localStorage.setItem('errores_E', JSON.stringify(arr));
    localStorage.setItem('simbtable_E', JSON.stringify(arr));
    localStorage.setItem('console', "");

    try{
      var ast_trans = ast.parse(this.text2);
      this.ast = ast_trans;
    }catch(e){ console.log(e); console.log("error ast ejecucion"); }


    try{
      interprete.parse(this.text2);
      this.child3.current.agregar_datos(JSON.parse(localStorage.getItem('errores_E')));
      this.child4.current.agregar_datos(JSON.parse(localStorage.getItem('simbtable_E')));
      this.setState({
        value: localStorage.getItem('console'),
      });
    }catch(e){ console.log(e); }
    

  }

  get_text_translate = (texto) => {
    this.text1 = texto;
    //var t = this.state.value;
    //t +="hola";
    //this.setState({value: t});
  }

  get_text_ejecute = (texto) => {
    this.text2 = texto;
  }

  state = { showing: false };

  render () {
    const { showing } = this.state;
    let options = {
      fit: true,
      height: "100%",
      width: "100%",
      zoom: true
		};
    return (
      <div className="jumbotron">
        <div>
          <ul className="nav nav-pills">
            <li className="nav-item">
              <a className="nav-link " role="button" onClick={this.translate_input}>Traducir</a>
            </li>
            <li className="nav-item">
              <a className="nav-link " role="button"  onClick={this.ejecutar_input}>Ejecutar</a>
            </li>
          </ul>
        </div>

        <div className="card border-primary mb-3">
        <div className="card-body">
          <div className="row">
            <div className="col">
              <div className="card-header">Translate</div>
              <div className="card-body">
                <TextArea get_text = {this.get_text_translate} ref={this.child1} ></TextArea>
              </div> 
            </div>
            <div className="col">
            <div className="card-header">Ejecute</div>
              <div className="card-body">
                <TextArea get_text = {this.get_text_ejecute} ref={this.child2}></TextArea>
              </div>
            </div>
          </div>
          </div>
        </div>

        <div className="card border-primary mb-3">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <a className="nav-link active" data-toggle="tab" href="#console">Consola</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" data-toggle="tab" href="#errores">Errores</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" data-toggle="tab" href="#tabsimbol">tabla de símbolos</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" data-toggle="tab" href="#arbol">AST</a>
            </li>
          </ul>
          <div id="myTabContent" className="tab-content">
            <div className="tab-pane fade active show" id="console">
              <div className="card-body">
                <textarea className="form-control" rows="8" value={this.state.value} disabled={true}/>
              </div>
            </div>
            <div className="tab-pane fade" id="errores">
              <div className="card-body">
                <Table data={this.errors} ref={this.child3}/>
              </div>
            </div>
            <div className="tab-pane fade" id="tabsimbol">
              <div className="card-body">
                <Table data={this.table_simbol} ref={this.child4}/>
              </div>
            </div>
            <div className="tab-pane fade" id="arbol">
              <div className="card-body">
                <button className="btn btn-primary btn-lg btn-block" onClick={() => this.setState({ showing: !showing })}>Show AST</button>
                <div className="card-body">
                  { showing 
                    ? <div>
                        <Graphviz dot={this.ast} options={options}/>
                    </div>
                    : null
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;


/*

<div id="myTabContent" class="tab-content">
  <div class="tab-pane fade active show" id="home">
    <p>Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor, williamsburg carles vegan helvetica. Reprehenderit butcher retro keffiyeh dreamcatcher synth. Cosby sweater eu banh mi, qui irure terry richardson ex squid. Aliquip placeat salvia cillum iphone. Seitan aliquip quis cardigan american apparel, butcher voluptate nisi qui.</p>
  </div>
  <div class="tab-pane fade" id="profile">
    <p>Food truck fixie locavore, accusamus mcsweeney's marfa nulla single-origin coffee squid. Exercitation +1 labore velit, blog sartorial PBR leggings next level wes anderson artisan four loko farm-to-table craft beer twee. Qui photo booth letterpress, commodo enim craft beer mlkshk aliquip jean shorts ullamco ad vinyl cillum PBR. Homo nostrud organic, assumenda labore aesthetic magna delectus mollit.</p>
  </div>
  <div class="tab-pane fade" id="dropdown1">
    <p>Etsy mixtape wayfarers, ethical wes anderson tofu before they sold out mcsweeney's organic lomo retro fanny pack lo-fi farm-to-table readymade. Messenger bag gentrify pitchfork tattooed craft beer, iphone skateboard locavore carles etsy salvia banksy hoodie helvetica. DIY synth PBR banksy irony. Leggings gentrify squid 8-bit cred pitchfork.</p>
  </div>
  <div class="tab-pane fade" id="dropdown2">
    <p>Trust fund seitan letterpress, keytar raw denim keffiyeh etsy art party before they sold out master cleanse gluten-free squid scenester freegan cosby sweater. Fanny pack portland seitan DIY, art party locavore wolf cliche high life echo park Austin. Cred vinyl keffiyeh DIY salvia PBR, banh mi before they sold out farm-to-table VHS viral locavore cosby sweater.</p>
  </div>
</div>


        <div className="card border-primary mb-3">
          <div className="card-header">Árbol de sintaxis abstracta</div>
          <button className="btn btn-secondary" onClick={() => this.setState({ showing: !showing })}>Show AST</button>
          <div className="card-body">
            { showing 
              ? <div>
                  <Graphviz dot={this.ast} options={options}/>
              </div>
              : null
            }
          </div>
        </div>
*/