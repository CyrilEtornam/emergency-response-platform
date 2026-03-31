package com.erp.dispatch_service.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {

    @Value("${rabbitmq.exchange}")
    private String exchange;

    @Value("${rabbitmq.dispatch-queue:dispatch.incident.queue}")
    private String dispatchQueue;

    @Bean
    public TopicExchange erpEventsExchange() {
        return new TopicExchange(exchange, true, false);
    }

    @Bean
    public Queue dispatchIncidentQueue() {
        return new Queue(dispatchQueue, true);
    }

    @Bean
    public Binding dispatchBinding(Queue dispatchIncidentQueue, TopicExchange erpEventsExchange) {
        return BindingBuilder.bind(dispatchIncidentQueue)
                .to(erpEventsExchange)
                .with("dispatch.assigned");
    }

    @Bean
    public Jackson2JsonMessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory,
                                         Jackson2JsonMessageConverter messageConverter) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(messageConverter);
        return template;
    }
}
