require 'net/http'
require 'uri'

class ProxiesController < ApplicationController
  include Sprockets::Helpers::RailsHelper

  URLS = {
          'cdff'       => 'http://www.christiandatingforfree.com',
          'rekindleit' => 'http://rekindle.it'
  }

  before_filter :retrieve_url

  def proxy
    #http = EM::HttpRequest.new(@url).get
    #status = http.response_header.status
    #content_type = http.response_header['CONTENT_TYPE']

    http = Net::HTTP.get_response(URI.parse(@url))
    status = http.code.to_i
    content_type = http.content_type

    if status == 200
      bits = http.body
      if rewrite_html(@url, http)
        rewrite_links! bits
        inject_javascript! bits
      end

      render :text => bits, :content_type => content_type
    else
      render :status => status, :nothing => true
    end
  end

  private

  def rewrite_html(url, http)
    return false unless http.content_type == 'text/html'
    return false if url =~ /iframe/  # hack for CDFF

    true
  end

  def retrieve_url
    @site = params[:site]
    @path = '/' + (params[:path] || '')
    @url = URLS[@site] + @path

    if URLS[@site].nil?
      render :status => :not_found, :nothing => true
    end
  end

  def inject_javascript!(html)
    js_include = javascript_include_tag "tourbot-#{@site}"
    fake_path = "<script type='text/javascript'>var __tourbot_fake_path = '#{@path}';</script>"

    html.sub!(/(<head>)/i, '\1' + "\n" + fake_path + "\n" + js_include + "\n")
  end

  def rewrite_links!(html)
    html.gsub!(/((src|href)=['"])\//, '\1/proxy/' + @site + '/')
  end

  def controller
    self
  end

end