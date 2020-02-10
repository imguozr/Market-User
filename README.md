# Virtual-Stock-Market
Backend of a virtual stock exchange system based on [`Koa`](https://github.com/koajs/koa).

## What is it for? 
This is a real-time stock brokerage web application for end users to sell/purchase stocks, which includes a real-time stock price inquiring system.

## What does it support?
1. Stock exchanges (buy/sell) are limited only on workdays. 
2. Users can check the real-time price and price history of specific stocks during the past 5 years. 
3. Users can buy or sell several stocks for one-time or recurring based on a schedule from their account balance.
4. Users can transfer money from/to bank accounts. 
5. Users can modify their recurring stock buy/sell schedule. 

## Other Features
- HTTPS for safety.
- OAuth Single Sign-On with GitHub accounts. 
- Asynchronous Service. Buy/Sell stocks are implemented asynchronously by using [`Bull`](https://github.com/OptimalBits/bull). 

## API Documents
See [API doc](https://imguozr.github.io/Virtual-Stock-Market/).
